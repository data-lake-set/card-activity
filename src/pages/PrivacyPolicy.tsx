import { PdfViewer } from '../components/pdfViewer/PdfViewer';
import privacyPolicy from './../assets/documents/DATA_RIVER_PRIVACY_POLICY.pdf';

export const PrivacyPolicy = () => <PdfViewer file={privacyPolicy} />;
