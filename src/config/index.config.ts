/* eslint-disable prettier/prettier */
import * as fs from 'fs';

export const credentials = {
  pfx: fs.readFileSync(process.env.PFX_FILE),
  passphrase: process.env.PFX_PASSPHRASE,
  ca: fs.readFileSync(process.env.INTERCERT_FILE)
}