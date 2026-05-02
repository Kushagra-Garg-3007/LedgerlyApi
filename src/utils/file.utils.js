const fs = require("fs/promises");

/**
 * Delete a local file if it exists.
 * If delete fails, do not fail the API request.
 */
async function deleteFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (_error) {
    // Cleanup is optional. Ignore delete errors.
  }
}

module.exports = {
  deleteFile,
};
