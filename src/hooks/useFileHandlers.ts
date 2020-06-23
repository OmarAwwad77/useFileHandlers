import { useReducer, useCallback, useEffect, useRef } from 'react';
import { logUploadedFile, uploadFile } from './utils';
import { Actions, InitialState, Uploads, OnChangeInput } from './types';

const initialState: InitialState = {
	files: [],
	pending: [],
	next: null,
	uploading: false,
	uploaded: {},
	status: 'idle',
	uploadError: null,
};

const reducer = (state: typeof initialState, action: Actions): InitialState => {
	switch (action.type) {
		case 'LOAD':
			return { ...state, files: action.files, status: 'loaded' };

		case 'SUBMIT':
			return {
				...state,
				uploading: true,
				pending: state.files,
				status: 'init',
			};

		case 'NEXT':
			return { ...state, next: action.next, status: 'pending' };

		case 'FILE_UPLOADED':
			return {
				...state,
				next: null,
				pending: action.pending,
				uploaded: {
					...state.uploaded,
					[action.prev.id]: action.prev.file,
				},
			};

		case 'FILES_UPLOADED':
			return { ...state, uploading: false, status: 'files-uploaded' };

		case 'UPLOAD_ERROR':
			return { ...state, uploadError: action.error, status: 'upload-error' };

		default:
			return state;
	}
};

const useFileHandlers = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const countRef = useRef(0);

	useEffect(() => {
		if (state.pending.length && state.next == null) {
			const next = state.pending[0];
			dispatch({ type: 'NEXT', next });
		}
	}, [state.next, state.pending]);

	useEffect(() => {
		if (state.next) {
			const { next } = state;

			uploadFile(next)
				.then(() => {
					const prev = next;
					logUploadedFile(++countRef.current);
					const pending = state.pending.slice(1);
					dispatch({ type: 'FILE_UPLOADED', prev, pending });
				})
				.catch((error) => {
					console.error(error);
					dispatch({ type: 'UPLOAD_ERROR', error });
				});
		}
	}, [state]);

	useEffect(() => {
		if (!state.pending.length && state.uploading) {
			dispatch({ type: 'FILES_UPLOADED' });
		}
	}, [state.pending.length, state.uploading]);

	useEffect(() => {
		if (state.status === 'files-uploaded') {
			state.files.forEach((file) => {
				console.log(
					'%crevoking objectURLs for file: ' + (file.id + 1),
					'color:red;font-weight: bold'
				);
				window.URL.revokeObjectURL(file.src);
			});
		}
	}, [state.status]);

	const onSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (state.files.length) {
				dispatch({ type: 'SUBMIT' });
			} else {
				window.alert("You don't have any files loaded.");
			}
		},
		[state.files.length]
	);

	const onChange: OnChangeInput = useCallback((e) => {
		if (e.target.files) {
			const files: Uploads = Array.from(e.target.files).map((file, index) => ({
				file,
				id: index,
				src: window.URL.createObjectURL(file),
			}));
			dispatch({ files, type: 'LOAD' });
		}
	}, []);

	return {
		...state,
		onChange,
		onSubmit,
	};
};

export default useFileHandlers;
