import React from 'react';
import useFileHandlers from './hooks/useFileHandlers';
import './App.css';
import { OnChangeInput } from './hooks/types';

const Input = (props: { onChange: OnChangeInput }) => (
	<input
		type='file'
		accept='image/*'
		name='img-loader-input'
		multiple
		{...props}
	/>
);

function App() {
	const { files, onChange, onSubmit, status, uploaded } = useFileHandlers();

	return (
		<div className='container'>
			<form className='form' onSubmit={onSubmit}>
				{status === 'files-uploaded' && (
					<div className='success-container'>
						<div>
							<h2>Congratulations!</h2>
							<small>You uploaded your files. Get some rest.</small>
						</div>
					</div>
				)}
				<div>
					<Input onChange={onChange} />
					<button type='submit'>Submit</button>
				</div>
				<div>
					{files.map(({ file, src, id }, index) => (
						<div
							style={{
								opacity: uploaded[id] ? 0.2 : 1,
							}}
							key={`thumb${index}`}
							className='thumbnail-wrapper'
						>
							<img className='thumbnail' src={src} alt='' />
							<div className='thumbnail-caption'>{file.name}</div>
						</div>
					))}
				</div>
			</form>
		</div>
	);
}

export default App;
