
import React, { useState, useRef, useCallback } from 'react';
import { Part } from '@google/genai';
import { useToast } from '../App';
import { analyzeVideoFramesForSafety } from '../services/geminiService';
import type { SafetyEvent, User } from '../types';
import { AccessControlOverlay } from '../components/AccessControlOverlay';
import { VideoCameraIcon, SparklesIcon, ArrowPathIcon } from '../components/Icons';

const FRAME_RATE = 1; // 1 frame per second
const FRAME_QUALITY = 0.5; // JPEG quality

interface SafetyCameraPageProps {
    user: User | null;
}

export const SafetyCameraPage: React.FC<SafetyCameraPageProps> = ({ user }) => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [events, setEvents] = useState<SafetyEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const showToast = useToast();
    const isAllowed = !!user?.subscription;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setEvents([]);
        }
    };

    const extractFrames = useCallback((): Promise<Part[]> => {
        return new Promise((resolve, reject) => {
            if (!videoRef.current || !canvasRef.current) {
                return reject(new Error("Video or canvas element not found."));
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (!context) return reject(new Error("Could not get canvas context."));

            const frames: Part[] = [];
            let currentTime = 0;

            video.currentTime = 0;

            const captureFrame = () => {
                if (currentTime > video.duration) {
                    resolve(frames);
                    return;
                }

                video.currentTime = currentTime;
                
                setTimeout(() => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64data = (reader.result as string).split(',')[1];
                                frames.push({
                                    inlineData: {
                                        mimeType: 'image/jpeg',
                                        data: base64data
                                    }
                                });
                            };
                            reader.readAsDataURL(blob);
                        }
                    }, 'image/jpeg', FRAME_QUALITY);
                    
                    currentTime += 1 / FRAME_RATE;
                    captureFrame();

                }, 100); // Small delay to allow the video to seek
            };
            
            video.addEventListener('seeked', captureFrame, { once: true });
        });
    }, []);

    const handleAnalyze = async () => {
        if (!videoRef.current) {
            showToast({ type: 'error', message: 'Carregue um vídeo primeiro.' });
            return;
        }
        setIsLoading(true);
        setEvents([]);
        try {
            const frames = await extractFrames();
            if (frames.length === 0) {
                showToast({ type: 'info', message: 'Nenhum frame extraído do vídeo.' });
                return;
            }
            const result = await analyzeVideoFramesForSafety(frames);
            
            const newEvents: SafetyEvent[] = result.events.map((event, index) => {
                const frameIndex = Math.min(index, frames.length - 1); // Approximate frame mapping
                const frameDataUrl = `data:image/jpeg;base64,${frames[frameIndex].inlineData.data}`;
                return {
                    ...event,
                    timestamp: new Date().toISOString(),
                    frameDataUrl,
                };
            });
            
            setEvents(newEvents);
            showToast({ type: 'success', message: `${newEvents.length} evento(s) identificado(s).` });
        } catch (error) {
            showToast({ type: 'error', message: error instanceof Error ? error.message : 'Falha na análise.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Câmera de Segurança Veicular com IA</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Envie o vídeo da sua dashcam e deixe a IA identificar placas, infrações e eventos de segurança relevantes.</p>
            </div>
            
            <AccessControlOverlay isAllowed={isAllowed} featureName="Câmera de Segurança com IA">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Video Player & Controls */}
                        <div className="space-y-4">
                            <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                                {videoSrc ? (
                                    <video ref={videoRef} src={videoSrc} controls className="w-full h-full rounded-lg" />
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <VideoCameraIcon className="w-16 h-16 mx-auto" />
                                        <p>Selecione um vídeo para começar</p>
                                    </div>
                                )}
                            </div>
                            <canvas ref={canvasRef} className="hidden"></canvas>
                             <div className="flex flex-col sm:flex-row gap-4">
                                <label htmlFor="video-upload" className="w-full text-center cursor-pointer bg-slate-100 text-slate-800 font-bold py-2 px-4 rounded-md hover:bg-slate-200">
                                    {videoSrc ? 'Trocar Vídeo' : 'Selecionar Vídeo'}
                                </label>
                                <input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

                                <button onClick={handleAnalyze} disabled={isLoading || !videoSrc} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                                    {isLoading ? 'Analisando...' : <><SparklesIcon className="w-5 h-5 mr-2" /> Analisar Vídeo</>}
                                </button>
                            </div>
                        </div>

                        {/* Right: Results */}
                        <div className="bg-slate-50 p-4 rounded-lg border min-h-[400px]">
                            <h2 className="font-bold text-lg mb-4">Eventos Identificados</h2>
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
                                    <p>Processando vídeo e analisando frames...</p>
                                </div>
                            )}
                            {!isLoading && events.length === 0 && (
                                <div className="text-center text-slate-500 pt-16">
                                    <p>Os eventos de segurança aparecerão aqui após a análise.</p>
                                </div>
                            )}
                            {!isLoading && events.length > 0 && (
                                <ul className="space-y-3 max-h-96 overflow-y-auto">
                                    {events.map((event, index) => (
                                        <li key={index} className="flex gap-4 p-2 bg-white rounded-md border">
                                            <img src={event.frameDataUrl} alt="Frame do evento" className="w-24 h-16 object-cover rounded flex-shrink-0" />
                                            <div>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${event.type === 'plate' ? 'bg-blue-100 text-blue-800' : event.type === 'infraction' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {event.type.toUpperCase()}
                                                </span>
                                                <p className="text-sm mt-1">{event.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </AccessControlOverlay>
        </main>
    );
};
