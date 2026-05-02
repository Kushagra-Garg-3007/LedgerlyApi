const XLSX = require("xlsx");
const { parseDate } = require("../utils/date.utils");
const { parseAmount } = require("../utils/number.utils");
const { normalizeHeader } = require("../utils/string.utils");

class StatementExcelParser {
  /**
   * Read the first sheet and return parsed transaction rows.
   * This file only parses data and does not touch the database.
   */
  parseTransactions(filePath) {
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];
    const rows = this.extractTransactionRows(firstSheet);

    const validRows = [];
    let rejectedRows = 0;

    rows.forEach((row) => {
      const mapped = this.mapRowToTransaction(row.data);
      if (!mapped) {
        rejectedRows += 1;
        return;
      }

      validRows.push({
        ...mapped,
        sourceRow: row.sourceRow,
      });
    });

    return { validRows, rejectedRows };
  }

  /**
   * Find where the transaction table starts and turn each row into an object.
   */
  extractTransactionRows(sheet) {
    const matrix = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
      raw: false,
      blankrows: false,
    });

    if (!Array.isArray(matrix) || matrix.length === 0) {
      return [];
    }

    // Many statement files have account details before the actual transaction table.
    const headerIndex = matrix.findIndex((row) => this.looksLikeTransactionHeader(row));
    if (headerIndex === -1) {
      return [];
    }

    const headers = (matrix[headerIndex] || []).map((cell) => String(cell || "").trim());
    const dataRows = matrix.slice(headerIndex + 1);
    const parsed = [];

    for (let idx = 0; idx < dataRows.length; idx += 1) {
      const rawRow = dataRows[idx];
      const values = rawRow || [];
      const nonEmpty = values.some((value) => String(value ?? "").trim() !== "");
      if (!nonEmpty) {
        continue;
      }

      // Skip divider rows like ****** or ----- because they are not real data.
      const isSeparator = values.every((value) => {
        const text = String(value ?? "").trim();
        return text === "" || /^[-*xX._]+$/.test(text);
      });
      if (isSeparator) {
        continue;
      }

      const rowObject = {};
      headers.forEach((header, columnIndex) => {
        if (!header) {
          return;
        }
        rowObject[header] = values[columnIndex] ?? null;
      });

      parsed.push({
        data: rowObject,
        sourceRow: headerIndex + idx + 2,
      });
    }

    return parsed;
  }

  /**
   * Check if this row looks like a transaction header row.
   */
  looksLikeTransactionHeader(row) {
    const normalizedCells = (row || []).map((cell) => normalizeHeader(cell)).filter(Boolean);
    const hasDate = normalizedCells.some((cell) => this.isDateHeader(cell));
    const hasDescription = normalizedCells.some((cell) => this.isDescriptionHeader(cell));
    const hasAmountSide = normalizedCells.some(
      (cell) =>
        this.isDebitHeader(cell) ||
        this.isCreditHeader(cell) ||
        this.isAmountHeader(cell),
    );

    return hasDate && hasDescription && hasAmountSide;
  }

  /**
   * Convert one Excel row into a clean transaction object.
   * Return null if key fields are missing.
   */
  mapRowToTransaction(row) {
    const dateRaw = this.pickValue(row, (header) => this.isDateHeader(header));
    const descriptionRaw = this.pickValue(row, (header) => this.isDescriptionHeader(header));
    const amountRaw = this.pickValue(row, (header) => this.isAmountHeader(header));
    const balanceRaw = this.pickValue(row, (header) => this.isBalanceHeader(header));
    const debitRaw = this.pickValue(row, (header) => this.isDebitHeader(header));
    const creditRaw = this.pickValue(row, (header) => this.isCreditHeader(header));
    const typeRaw = this.pickValue(row, (header) => this.isTypeHeader(header));

    const txnDate = parseDate(dateRaw);
    const description = typeof descriptionRaw === "string" ? descriptionRaw.trim() : "";
    const balance = parseAmount(balanceRaw);
    const { amount, txnType } = this.resolveAmountAndType(amountRaw, debitRaw, creditRaw, typeRaw);

    if (!txnDate || !description || amount === null || !txnType) {
      return null;
    }

    return {
      txnDate,
      description,
      amount,
      txnType,
      balance,
    };
  }

  /**
   * Find the first column value that matches a header rule.
   */
  pickValue(row, predicate) {
    const entries = Object.entries(row || {});
    for (const [key, value] of entries) {
      const normalizedKey = normalizeHeader(key);
      if (predicate(normalizedKey)) {
        return value;
      }
    }
    return null;
  }

  /**
   * Decide amount and type from either:
   * 1) one amount column, or 2) separate debit/credit columns.
   */
  resolveAmountAndType(amountRaw, debitRaw, creditRaw, typeRaw) {
    const directAmount = parseAmount(amountRaw);
    const directType = this.parseTransactionType(typeRaw, amountRaw);
    if (directAmount !== null && directType) {
      return { amount: directAmount, txnType: directType };
    }

    const debitAmount = parseAmount(debitRaw);
    if (debitAmount !== null) {
      return { amount: debitAmount, txnType: "DEBIT" };
    }

    const creditAmount = parseAmount(creditRaw);
    if (creditAmount !== null) {
      return { amount: creditAmount, txnType: "CREDIT" };
    }

    return { amount: null, txnType: null };
  }

  /**
   * Decide if this is DEBIT or CREDIT.
   * First use type column, else use amount sign.
   */
  parseTransactionType(typeValue, amountValue) {
    if (typeof typeValue === "string") {
      const normalized = typeValue.trim().toUpperCase();
      if (["DEBIT", "DR", "D"].includes(normalized)) {
        return "DEBIT";
      }
      if (["CREDIT", "CR", "C"].includes(normalized)) {
        return "CREDIT";
      }
    }

    const numericAmount = Number(String(amountValue || "").replace(/,/g, "").trim());
    if (Number.isNaN(numericAmount)) {
      return null;
    }
    return numericAmount < 0 ? "DEBIT" : "CREDIT";
  }

  /** Helper checks to match common bank header names. */
  isDateHeader(header) {
    return (
      header.includes("date") ||
      header.includes("value dt") ||
      header.includes("value date") ||
      header.includes("txn date") ||
      header.includes("transaction date")
    );
  }

  isDescriptionHeader(header) {
    return (
      header.includes("narration") ||
      header.includes("description") ||
      header.includes("remark") ||
      header.includes("detail") ||
      header.includes("particular")
    );
  }

  isAmountHeader(header) {
    return (
      header === "amount" ||
      (header.includes("amount") &&
        !header.includes("withdraw") &&
        !header.includes("debit") &&
        !header.includes("deposit") &&
        !header.includes("credit") &&
        !header.includes("balance"))
    );
  }

  isBalanceHeader(header) {
    return (
      header.includes("balance") ||
      header.includes("closing balance") ||
      header.includes("final balance")
    );
  }

  isDebitHeader(header) {
    return (
      header.includes("withdraw") ||
      header.includes("debit") ||
      header.includes("dr amount") ||
      header === "dr"
    );
  }

  isCreditHeader(header) {
    return (
      header.includes("deposit") ||
      header.includes("credit") ||
      header.includes("cr amount") ||
      header === "cr"
    );
  }

  isTypeHeader(header) {
    return header.includes("type") || header.includes("dr cr") || header.includes("debit credit");
  }
}

module.exports = new StatementExcelParser();
