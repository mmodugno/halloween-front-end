// Original pixel sprites. Each row is a string; every character maps to a
// color in the sprite's palette and "." is transparent.

export const ghost = {
  palette: { X: "#5B4A7A", W: "#F4F0FF", E: "#231B33", R: "#E58FA0", M: "#3A2C52" },
  rows: [
    ".....XXXXXX.....",
    "...XXWWWWWWXX...",
    "..XWWWWWWWWWWX..",
    ".XWWWWWWWWWWWWX.",
    ".XWWWWWWWWWWWWX.",
    "XWWWEEWWWWEEWWWX",
    "XWWWEEWWWWEEWWWX",
    "XWWWWWWWWWWWWWWX",
    "XWWRRWWMMWWRRWWX",
    "XWWWWWWMMWWWWWWX",
    "XWWWWWWWWWWWWWWX",
    "XWWWWWWWWWWWWWWX",
    "XWWWWWWWWWWWWWWX",
    "XWWXXWWWWXXWWWWX",
    "XWX..XWWX..XWWX.",
    ".X....XX....XX..",
  ],
};

export const pumpkin = {
  palette: { G: "#7FB77E", X: "#8A3B2E", O: "#F2A65A", D: "#D9823F", Y: "#FFE8C2" },
  rows: [
    "........GG......",
    ".......GG.......",
    "...XXXXXXXXXX...",
    "..XOODOOOODOOX..",
    ".XOOODOOOODOOOX.",
    "XOOOODOOOODOOOOX",
    "XOYYODOOOODOYYOX",
    "XOYYODOOOODOYYOX",
    "XOOOODOOOODOOOOX",
    "XOOYYYYYYYYYYOOX",
    "XOOOYYOYYOYYOOOX",
    ".XOOODOOOODOOOX.",
    "..XOODOOOODOOX..",
    "...XXXXXXXXXX...",
  ],
};

export const bat = {
  palette: { X: "#6C5A8E", E: "#F2A65A" },
  rows: [
    "XX....X..X....XX",
    "XXX...XXXX...XXX",
    "XXXX.XEXXEX.XXXX",
    ".XXXXXXXXXXXXXX.",
    "..XX.XXXXXX.XX..",
    "......XXXX......",
    ".......XX.......",
  ],
};

export const skull = {
  palette: { X: "#5B4A7A", B: "#FFE8C2", E: "#3A2C52" },
  rows: [
    ".XXXXXXXX.",
    "XBBBBBBBBX",
    "XBBBBBBBBX",
    "XBEEBBEEBX",
    "XBEEBBEEBX",
    "XBBBBBBBBX",
    "XBBBEEBBBX",
    ".XBBBBBBX.",
    ".XBXBXBX..",
    "..XXXXXX..",
  ],
};

export const heart = {
  palette: { H: "#E58FA0", L: "#F6C3CC" },
  rows: [
    ".HH.HH.",
    "HLHHHHH",
    "HHHHHHH",
    ".HHHHH.",
    "..HHH..",
    "...H...",
  ],
};

export const crown = {
  palette: { Y: "#F7D774", R: "#E58FA0", D: "#D9A441" },
  rows: [
    "Y...Y...Y",
    "YY.YYY.YY",
    "YYYYYYYYY",
    "YRYYRYYRY",
    "DDDDDDDDD",
  ],
};

export const moon = {
  palette: { M: "#FFE8C2", C: "#F1D3A4" },
  rows: [
    "....MMMM....",
    "..MMMMMMMM..",
    ".MMMMMMMCMM.",
    ".MMMMMMMMMM.",
    "MMMCMMMMMMMM",
    "MMMMMMMMMMMM",
    "MMMMMMMMMCMM",
    "MMMMMMMMMMMM",
    ".MMMMCMMMMM.",
    ".MMMMMMMMMM.",
    "..MMMMMMMM..",
    "....MMMM....",
  ],
};

// Sprites shown on the candidate rows, picked by position.
export const candidateSprites = [pumpkin, bat, skull];
