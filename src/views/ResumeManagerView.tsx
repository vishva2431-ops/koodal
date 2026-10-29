import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  Edit3, 
  Save, 
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResumeVersion } from '../types';
import { 
  validateResumeFile, 
  extractTextFromFile, 
  analyzeResumeText 
} from '../services/resumeExtractor';

export const ResumeManagerView: React.FC = () => {
  const { profile, updateProfile } = useApp();

  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active review/editing of extracted text
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editableText, setEditableText] = useState('');
  const [viewingResume, setViewingResume] = useState<ResumeVersion | null>(null);

  const resumes = profile.resumes || [];
  const activeResumeId = profile.activeResumeId || resumes[0]?.id;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Validate file format & size
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    try {
      // 2. Extract text in-browser (zero-cost, no paid API)
      const rawText = await extractTextFromFile(file);
      const analyzed = analyzeResumeText(rawText, file);

      const newResume: ResumeVersion = {
        id: `res_${Date.now()}`,
        name: file.name,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        extractedText: rawText || 'Extracted document content',
        parsedSkills: analyzed.detectedSkills,
        isDefault: resumes.length === 0,
      };

      const updatedResumes = [...resumes, newResume];
      
      // Auto-merge newly detected skills into profile if user desires
      const existingSkills = new Set(profile.skills || []);
      analyzed.detectedSkills.forEach(s => existingSkills.add(s));

      await updateProfile({
        resumes: updatedResumes,
        activeResumeId: newResume.id,
        skills: Array.from(existingSkills),
      });

      setSuccessMessage(`Extracted ${analyzed.detectedSkills.length} skills from ${file.name}. Review and edit below before saving.`);
      setEditingResumeId(newResume.id);
      setEditableText(newResume.extractedText);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing document');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSetDefault = async (resumeId: string) => {
    const updated = resumes.map(r => ({
      ...r,
      isDefault: r.id === resumeId,
    }));
    await updateProfile({
      resumes: updated,
      activeResumeId: resumeId,
    });
    setSuccessMessage('Default resume updated for automated applications.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteResume = async (resumeId: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this resume version?');
    if (!confirmDelete) return;

    const updated = resumes.filter(r => r.id !== resumeId);
    await updateProfile({
      resumes: updated,
      activeResumeId: updated[0]?.id || undefined,
    });
    if (editingResumeId === resumeId) {
      setEditingResumeId(null);
    }
    if (viewingResume?.id === resumeId) {
      setViewingResume(null);
    }
    setSuccessMessage('Resume version removed.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveEditedText = async (resumeId: string) => {
    const updated = resumes.map(r => 
      r.id === resumeId ? { ...r, extractedText: editableText } : r
    );
    await updateProfile({ resumes: updated });
    setEditingResumeId(null);
    setSuccessMessage('Extracted resume text updated successfully.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <span>Zero-Cost In-Browser Document Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Resume Manager & Text Extractor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Parses PDF and DOCX files directly inside your browser. No files are uploaded to public buckets or paid AI cloud services.
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs shrink-0">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'Extracting Text...' : 'Upload PDF / DOCX'}</span>
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Upload Dropzone / Quick Info */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Client-Side Isolation:</strong> File data stays in your browser memory and private local storage. Max file size: 5MB. Supported formats: .pdf, .docx, .txt.
          </span>
        </div>
      </div>

      {/* Saved Resume Versions List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Saved Resume Versions ({resumes.length})
        </h3>

        {resumes.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No resume uploaded yet</p>
            <p className="mt-1">Upload your PDF or DOCX resume to extract technical skills and enable one-click applications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {resumes.map(resume => {
              const isDefault = resume.id === activeResumeId;
              const isEditing = editingResumeId === resume.id;

              return (
                <div key={resume.id} className="py-4 first:pt-1 last:pb-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs truncate">{resume.name}</span>
                          {isDefault && (
                            <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                          <span>{Math.round(resume.fileSize / 1024)} KB</span>
                          <span aria-hidden="true">·</span>
                          <span>Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-IN')}</span>
                          <span aria-hidden="true">·</span>
                          <span>{resume.parsedSkills?.length || 0} skills detected</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center text-xs">
                      {!isDefault && (
                        <button
                          onClick={() => handleSetDefault(resume.id)}
                          className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingResumeId(null);
                          } else {
                            setEditingResumeId(resume.id);
                            setEditableText(resume.extractedText);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditing ? 'Cancel Edit' : 'Edit Extracted Text'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete resume version"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Parsed skills chips */}
                  {resume.parsedSkills && resume.parsedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {resume.parsedSkills.map(s => (
                        <span key={s} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Inline Editor for extracted text */}
                  {isEditing && (
                    <div className="pt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-xs">
                          Edit Extracted Resume Text (Ensure accuracy before application prep)
                        </span>
                        <button
                          onClick={() => handleSaveEditedText(resume.id)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                      <textarea
                        rows={8}
                        value={editableText}
                        onChange={e => setEditableText(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded font-mono text-[11px] text-slate-800 leading-relaxed focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
