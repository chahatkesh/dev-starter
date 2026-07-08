function quoteFilePath(filePath) {
  return JSON.stringify(filePath);
}

const lintStagedConfig = {
  "*.{css,json,md,mdx,yml,yaml}": (filePaths) => {
    if (filePaths.length === 0) {
      return [];
    }

    return [`prettier --write ${filePaths.map(quoteFilePath).join(" ")}`];
  },
  "*.{js,jsx,ts,tsx,mjs,cjs}": (filePaths) => {
    if (filePaths.length === 0) {
      return [];
    }

    const files = filePaths.map(quoteFilePath).join(" ");

    return [`prettier --write ${files}`, `eslint --fix ${files}`];
  },
};

export default lintStagedConfig;
