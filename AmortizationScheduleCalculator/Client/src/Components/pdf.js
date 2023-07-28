import React, { Component } from 'react';
import lesson2 from './Example.pdf'
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


class Pdf extends React.Component {
	constructor(props) {

		super(props);
		this.state = { numPages: null, pageNumber: 1 };

	};

	QSetView = (obj) => {
		this.setState({
			CurrentPage: obj.page
		});
	};

	QSetViewInParent = (obj) => {
		this.props.QIDFromChild(obj);
	};
	onDocumentLoadSuccess = ({ numPages }) => {
		this.setState({ numPages });
	};

	goToPrevPage = () =>
		this.setState((state) => ({ pageNumber: state.pageNumber - 1 }));
	goToNextPage = () =>
		this.setState((state) => ({ pageNumber: state.pageNumber + 1 }));

	downloadPDF = async () => {
		const file = { lesson2 }; // Assuming "lesson2" is a URL to the PDF file
		//const response = await fetch(file);
		const arrayBuffer = new Uint8Array(file).buffer;

		// Create a new Blob object
		const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'Example.pdf'; // Change the filename as needed
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	render() {
		const { pageNumber, numPages } = this.state;

		return (
			<div>
				<nav>
					<button onClick={this.goToPrevPage}>Prev</button>
					<button onClick={this.goToNextPage}>Next</button>
					<button onClick={this.downloadPDF}>Download PDF</button> {/* Add this button */}

				</nav>

				<div style={{ width: 600 }}>
					<Document
						file={lesson2}
						onLoadSuccess={this.onDocumentLoadSuccess}
					>
						<Page pageNumber={pageNumber} width={600} />
					</Document>
				</div>

				<p>
					Page {pageNumber} of {numPages}
				</p>
			</div>
		);
	}
}
export default Pdf;