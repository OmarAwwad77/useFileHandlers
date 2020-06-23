import { ChangeEventHandler } from 'react';

export type OnChangeInput = ChangeEventHandler<HTMLInputElement>;
export type Upload = { file: File; id: number; src: string };
export type Uploads = Upload[];
export type Uploaded = {
	[key in number]: File;
};

export interface InitialState {
	files: Uploads;
	pending: Upload[];
	next: null | Upload;
	uploading: boolean;
	uploaded: Uploaded;
	status:
		| 'idle'
		| 'loaded'
		| 'pending'
		| 'init'
		| 'upload-error'
		| 'files-uploaded';
	uploadError: string | null;
}

// action types
export const LOAD = 'LOAD';
export const SUBMIT = 'SUBMIT';
export const NEXT = 'NEXT';
export const PENDING = 'PENDING';
export const FILE_UPLOADED = 'FILE_UPLOADED';
export const FILES_UPLOADED = 'FILES_UPLOADED';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';

// actions
interface Load {
	type: typeof LOAD;
	files: Uploads;
}

interface Submit {
	type: typeof SUBMIT;
}

interface Next {
	type: typeof NEXT;
	next: Upload;
}

interface Pending {
	type: typeof PENDING;
}

interface FileUploaded extends Pick<InitialState, 'pending'> {
	type: typeof FILE_UPLOADED;
	prev: Upload;
}

interface FilesUploaded {
	type: typeof FILES_UPLOADED;
}

interface UploadError {
	type: typeof UPLOAD_ERROR;
	error: string;
}

export type Actions =
	| Load
	| Submit
	| Next
	| Pending
	| FileUploaded
	| FilesUploaded
	| UploadError;
