import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/useStore';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight } from 'lucide-react';

export function QuestionExtractor({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addToQueue } = useStore();
  const [selected, setSelected] = React.useState<string[]>([]);

  // Mock extracted questions
  const extractedQuestions = [
    "What is the total revenue for Q3 2024?",
    "Identify any legal risks mentioned in the terms.",
    "List all competitors mentioned in the strategy section.",
    "What is the projected growth for the Asia Pacific region?",
    "Are there any compliance issues flagged?",
    "Summary of key executive changes.",
    "Explain the reason for the dip in gross margin.",
  ];

  React.useEffect(() => {
    if (open) {
      setSelected(extractedQuestions); // Select all by default
    }
  }, [open]);

  const handleToggle = (question: string) => {
    if (selected.includes(question)) {
      setSelected(selected.filter(q => q !== question));
    } else {
      setSelected([...selected, question]);
    }
  };

  const handleConfirm = () => {
    addToQueue(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
             </div>
             <div>
                <DialogTitle>Found {extractedQuestions.length} Questions</DialogTitle>
                <DialogDescription>
                  We identified these questions from the uploaded document.
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-[300px] border rounded-md bg-secondary/10 p-1">
           <ScrollArea className="h-full max-h-[400px]">
              <div className="p-4 space-y-3">
                 {extractedQuestions.map((q, i) => (
                   <div key={i} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border shadow-sm">
                      <Checkbox 
                        checked={selected.includes(q)}
                        onCheckedChange={() => handleToggle(q)}
                        id={`q-${i}`}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`q-${i}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {q}
                        </label>
                        <div className="flex gap-2">
                           <Badge variant="secondary" className="text-[10px] h-5">Financial</Badge>
                           <Badge variant="outline" className="text-[10px] h-5 border-border">High Priority</Badge>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
           </ScrollArea>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={selected.length === 0}>
            Add {selected.length} to Queue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
