import React from 'react';
import type { FormData } from '../types';
import { documentConfigs, DocumentConfig } from '../configs/documentConfigs';
import { SparklesIcon, ClipboardIcon, TrashIcon, ArrowDownTrayIcon, SaveIcon, SpeakerWaveIcon, StopIcon } from '../components/Icons';
import { AccessControlOverlay } from '../components/AccessControlOverlay';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);


interface DocumentGeneratorPageProps {
  isAllowed: boolean;
  docType: string;
  handleDocTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  currentConfig: DocumentConfig;
  handleGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  isInitialState: boolean;
  formattedDocumentText: string;
  handleCopy: () => void;
  handleClear: () => void;
  handleSaveDraft: () => void;
  handleExportPDF: () => void;
  handleSpeak: () => void;
  isSpeaking: boolean;
}

export const DocumentGeneratorPage: React.FC<DocumentGeneratorPageProps> = ({
  isAllowed,
  docType,
  handleDocTypeChange,
  prompt,
  setPrompt,
  formData,
  handleInputChange,
  currentConfig,
  handleGenerate,
  isLoading,
  error,
  isInitialState,
  formattedDocumentText,
  handleCopy,
  handleClear,
  handleSaveDraft,
  handleExportPDF,
  handleSpeak,
  isSpeaking,
}) => {
  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Gerador de Documentos Jurídicos com IA</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Crie petições, contratos e pareceres em minutos. Preencha os dados e deixe a IA redigir a peça jurídica completa para você.</p>
      </div>

      <AccessControlOverlay isAllowed={isAllowed} featureName="Gerador de Documentos">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            
            {/* Document Type Selector */}
            <div className="mb-4">
              <label htmlFor="docType" className="block text-sm font-medium text-gray-800 mb-1">Tipo de Documento</label>
              <select
                id="docType"
                value={docType}
                onChange={handleDocTypeChange}
                className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {documentConfigs.map(doc => (
                  <option key={doc.value} value={doc.value}>{doc.label}</option>
                ))}
              </select>
            </div>

            {/* Prompt Textarea */}
            {docType && (
              <>
                <div className="mb-4">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-800 mb-1">{currentConfig.promptLabel}</label>
                  <textarea
                    id="prompt"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={currentConfig.promptPlaceholder}
                    className="w-full px-3 py-2 text-gray-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Dynamic Fields */}
                {currentConfig.fields.map(field => (
                  <div key={field.id} className="mb-4">
                    <InputField
                      id={field.id}
                      label={field.label}
                      value={formData[field.id] || ''}
                      onChange={handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gerando...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Gerar Documento
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Documento Gerado</h2>
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button onClick={handleSpeak} title={isSpeaking ? "Parar Leitura" : "Ler Texto"} className="p-2 text-slate-500 hover:bg-slate-100 rounded-md disabled:text-slate-300" disabled={isInitialState || isLoading}>
                  {isSpeaking ? <StopIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                </button>
                <button onClick={handleCopy} title="Copiar" className="p-2 text-slate-500 hover:bg-slate-100 rounded-md disabled:text-slate-300" disabled={isInitialState || isLoading}>
                  <ClipboardIcon className="w-5 h-5" />
                </button>
                <button onClick={handleSaveDraft} title="Salvar Rascunho" className="p-2 text-slate-500 hover:bg-slate-100 rounded-md disabled:text-slate-300" disabled={isInitialState || isLoading}>
                  <SaveIcon className="w-5 h-5" />
                </button>
                <button onClick={handleExportPDF} title="Exportar como PDF" className="p-2 text-slate-500 hover:bg-slate-100 rounded-md disabled:text-slate-300" disabled={isInitialState || isLoading}>
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
                <button onClick={handleClear} title="Limpar Tudo" className="p-2 text-red-500 hover:bg-red-100 rounded-md">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="h-6 text-sm" />

            {/* Output Area */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex-grow overflow-y-auto">
              {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
              
              {isInitialState && !isLoading && !error && (
                <div className="text-slate-500 text-center flex flex-col items-center justify-center h-full">
                  <SparklesIcon className="w-12 h-12 text-slate-300 mb-4" />
                  <p>Selecione um tipo de documento e preencha os campos para gerar seu documento.</p>
                </div>
              )}
              
              {isLoading && (
                <div className="text-slate-500 text-center flex flex-col items-center justify-center h-full">
                  <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Aguarde, a IA está redigindo o seu documento...</p>
                </div>
              )}

              {!isInitialState && !isLoading && !error && (
                <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                  {formattedDocumentText}
                </pre>
              )}
            </div>
          </div>
        </div>
      </AccessControlOverlay>
    </main>
  );
};
