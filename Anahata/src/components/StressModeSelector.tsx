import { useStressMode } from '@/contexts/StressModeContext';
import { GraduationCap, Briefcase, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const StressModeSelector = () => {
  const { stressMode, setStressMode, isActive } = useStressMode();

  return (
    <div className="card-3d p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">Exam & Work Stress Mode</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Temporary mode for exams, internships, or job pressure. AI reduces emotional probing, focuses on grounding.
          </p>
          
          {isActive && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stressMode === 'exam' && <GraduationCap className="w-4 h-4 text-primary" />}
                {stressMode === 'work' && <Briefcase className="w-4 h-4 text-primary" />}
                {stressMode === 'internship' && <Calendar className="w-4 h-4 text-primary" />}
                <span className="text-sm text-foreground">
                  {stressMode === 'exam' && 'Exam Mode Active'}
                  {stressMode === 'work' && 'Work Stress Mode Active'}
                  {stressMode === 'internship' && 'Internship Mode Active'}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStressMode('none')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Select value={stressMode} onValueChange={(value: any) => setStressMode(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select stress period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Stress Mode</SelectItem>
              <SelectItem value="exam">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Exam Period
                </span>
              </SelectItem>
              <SelectItem value="work">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Work Pressure
                </span>
              </SelectItem>
              <SelectItem value="internship">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Internship
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StressModeSelector;

