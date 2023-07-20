/* eslint-disable prettier/prettier */
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common'

export const multerOptions = (uploadPath: string) => ({
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|WebP)$/)) {
      cb(null, true)
    } else {
      cb(new HttpException(`Unsupport file type ${file.originalname}`, HttpStatus.BAD_REQUEST), false)
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true })
      }
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 6 * 1024 * 1024,
  }
});