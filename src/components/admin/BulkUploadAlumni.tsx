import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Upload, Download, CheckCircle2, XCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParsedAlumni {
  name: string;
  phone?: string;
  batch_year?: number | null;
  company?: string;
  current_position_en?: string;
  current_position_bn?: string;
  current_position_zh?: string;
  story_en?: string;
  story_bn?: string;
  story_zh?: string;
  isValid: boolean;
  errors: string[];
}

interface BulkUploadAlumniProps {
  onSuccess: () => void;
}

const SAMPLE_CSV_CONTENT = `name,phone,batch_year,company,current_position_en,current_position_bn,current_position_zh,story_en,story_bn,story_zh
রহিম উদ্দিন,01712345678,2020,Huawei Technologies,Software Engineer,সফটওয়্যার ইঞ্জিনিয়ার,软件工程师,My journey at Huawei...,হুয়াওয়েতে আমার যাত্রা...,我在华为的旅程...
করিম খান,01812345678,2021,Alibaba Group,Product Manager,প্রোডাক্ট ম্যানেজার,产品经理,Started as intern...,ইন্টার্ন হিসেবে শুরু...,从实习生开始...`;

export const BulkUploadAlumni = ({ onSuccess }: BulkUploadAlumniProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedAlumni[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const validateRow = (row: Record<string, string>): ParsedAlumni => {
    const errors: string[] = [];
    
    // Name is required
    const name = row.name?.trim() || '';
    if (!name) {
      errors.push('Name is required');
    }

    // Batch year validation
    let batch_year: number | null = null;
    if (row.batch_year) {
      const year = parseInt(row.batch_year, 10);
      if (isNaN(year) || year < 1900 || year > 2100) {
        errors.push('Invalid batch year');
      } else {
        batch_year = year;
      }
    }

    // Phone validation (optional, but if provided should be reasonable)
    const phone = row.phone?.trim() || '';

    return {
      name,
      phone: phone || undefined,
      batch_year,
      company: row.company?.trim() || undefined,
      current_position_en: row.current_position_en?.trim() || undefined,
      current_position_bn: row.current_position_bn?.trim() || undefined,
      current_position_zh: row.current_position_zh?.trim() || undefined,
      story_en: row.story_en?.trim() || undefined,
      story_bn: row.story_bn?.trim() || undefined,
      story_zh: row.story_zh?.trim() || undefined,
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        const validated = data.map(validateRow);
        setParsedData(validated);
      },
      error: (error) => {
        toast.error('Failed to parse file: ' + error.message);
      },
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFile(file);
    } else {
      toast.error('Please upload a CSV file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'alumni_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImport = async () => {
    const validRows = parsedData.filter(row => row.isValid);
    if (validRows.length === 0) {
      toast.error('No valid rows to import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    const chunkSize = 50;
    const chunks = [];
    for (let i = 0; i < validRows.length; i += chunkSize) {
      chunks.push(validRows.slice(i, i + chunkSize));
    }

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const insertData = chunk.map(row => ({
        name: row.name,
        phone: row.phone || null,
        batch_year: row.batch_year || null,
        company: row.company || null,
        current_position_en: row.current_position_en || null,
        current_position_bn: row.current_position_bn || null,
        current_position_zh: row.current_position_zh || null,
        story_en: row.story_en || null,
        story_bn: row.story_bn || null,
        story_zh: row.story_zh || null,
        is_active: true,
        is_featured: false,
      }));

      const { error } = await supabase.from('alumni').insert(insertData);
      
      if (error) {
        errorCount += chunk.length;
      } else {
        successCount += chunk.length;
      }

      setImportProgress(((i + 1) / chunks.length) * 100);
    }

    setIsImporting(false);
    
    if (errorCount === 0) {
      toast.success(`Successfully imported ${successCount} alumni`);
      setParsedData([]);
      setIsOpen(false);
      onSuccess();
    } else {
      toast.error(`Imported ${successCount}, failed ${errorCount}`);
      onSuccess();
    }
  };

  const validCount = parsedData.filter(r => r.isValid).length;
  const errorCount = parsedData.filter(r => !r.isValid).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Upload Alumni
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              "hover:border-primary/50"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Drop CSV file here or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csv-upload"
              onChange={handleFileSelect}
            />
            <label htmlFor="csv-upload">
              <Button variant="secondary" className="cursor-pointer" asChild>
                <span>Select File</span>
              </Button>
            </label>
            <div className="mt-4">
              <Button variant="link" size="sm" onClick={downloadTemplate} className="gap-1">
                <Download className="h-3 w-3" />
                Download Sample Template
              </Button>
            </div>
          </div>

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Valid: {validCount}
                  </span>
                  {errorCount > 0 && (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      Errors: {errorCount}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground">
                  Showing {Math.min(5, parsedData.length)} of {parsedData.length} rows
                </span>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 5).map((row, idx) => (
                      <TableRow key={idx} className={!row.isValid ? 'bg-red-50' : ''}>
                        <TableCell>
                          {row.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{row.name || '-'}</TableCell>
                        <TableCell>{row.phone || '-'}</TableCell>
                        <TableCell>{row.batch_year || '-'}</TableCell>
                        <TableCell>{row.company || '-'}</TableCell>
                        <TableCell>{row.current_position_en || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Import Progress */}
              {isImporting && (
                <div className="space-y-2">
                  <Progress value={importProgress} />
                  <p className="text-sm text-center text-muted-foreground">
                    Importing... {Math.round(importProgress)}%
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setParsedData([]); setIsOpen(false); }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={validCount === 0 || isImporting}
                  className="gap-2"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import {validCount} Alumni
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
