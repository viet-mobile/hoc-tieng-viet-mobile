// Where the tools are on this machine, so the browser tests run on Windows, macOS and Linux alike.
//   CHROME  the Chrome / Chromium executable (CHROME_PATH overrides; otherwise the usual place of the platform)
//   PYTHON  the Python launcher (PYTHON overrides; "python" on Windows, "python3" elsewhere)
//   TMP     the temp folder for throw-away browser profiles
const fs = require('fs');
const os = require('os');
const path = require('path');

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = {
    win32: [
      path.join(process.env['PROGRAMFILES'] || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(process.env['LOCALAPPDATA'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    ],
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      path.join(os.homedir(), 'Applications', 'Google Chrome.app', 'Contents', 'MacOS', 'Google Chrome'),
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'],
  }[process.platform] || [];
  return candidates.find(p => p && fs.existsSync(p)) || candidates[0] || 'chrome';
}

module.exports = {
  CHROME: findChrome(),
  PYTHON: process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'),
  TMP: os.tmpdir(),
};
