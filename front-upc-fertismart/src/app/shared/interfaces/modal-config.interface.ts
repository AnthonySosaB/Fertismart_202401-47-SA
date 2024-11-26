export interface IModalConfig {
    type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';
    title: string;
    isHTMLBody?: boolean;
    bodyDescription: string;
    hasPrimaryButton: boolean;
    primaryButtonText: string;
    primaryButtonAction: () => void;
    hasSecondaryButton: boolean;
    secondaryButtonText: string;
    secondaryButtonAction: () => void;
}