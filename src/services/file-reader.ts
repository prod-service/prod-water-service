import * as fs from 'fs';

export interface IOutFileSystem {
    readdirSync: typeof fs.readdirSync,
    readFileSync: typeof fs.readFileSync,
};

export interface IFileReaderServiceParams {
    fileService: IOutFileSystem
};

export default class FileReaderService implements IFileReaderServiceParams {
    fileService: IOutFileSystem

    constructor({ fileService }: IFileReaderServiceParams) {
        this.fileService = fileService
    }

    getDirFileList (inputDirPath: string): string[] {
        return this.fileService.readdirSync(inputDirPath);
    }

    getSingleFile (inputDirPath: string): Buffer {
        return this.fileService.readFileSync(inputDirPath);
    }
};
