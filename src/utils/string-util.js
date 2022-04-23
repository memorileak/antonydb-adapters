class StringUtil {
  ensurePrintable(mayNotPrintableString) {
    return mayNotPrintableString.replace(/[\x00-\x1f]/g, '?');
  }
}

const stringUtil = new StringUtil();

module.exports = {stringUtil};
