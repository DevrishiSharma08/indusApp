'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Square, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TimeTrackerProps {
  ticketId: string;
  initialStatus?: 'idle' | 'running' | 'paused' | 'completed';
  totalTime?: number; // in seconds
  pauseTime?: number; // in seconds
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export default function TimeTracker({
  ticketId,
  initialStatus = 'idle',
  totalTime = 0,
  pauseTime = 0,
  onStart,
  onPause,
  onResume,
  onComplete,
  disabled = false
}: TimeTrackerProps) {
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>(initialStatus);
  const [elapsedTime, setElapsedTime] = useState(totalTime);
  const [currentPauseTime, setCurrentPauseTime] = useState(pauseTime);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'running') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleStart = () => {
    setStatus('running');
    setSessionStartTime(Date.now());
    onStart?.();
  };

  const handlePause = () => {
    setStatus('paused');
    setPauseStartTime(Date.now());
    onPause?.();
  };

  const handleResume = () => {
    if (pauseStartTime) {
      const pauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
      setCurrentPauseTime(prev => prev + pauseDuration);
    }
    setStatus('running');
    setPauseStartTime(null);
    onResume?.();
  };

  const handleComplete = () => {
    setStatus('completed');
    onComplete?.();
  };

  const actualTime = elapsedTime - currentPauseTime;

  return (
    <div className="space-y-3">
      {/* Time Display */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Total:</span>
          <Badge variant="outline" className="font-mono">
            {formatTime(elapsedTime)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Actual:</span>
          <Badge variant="secondary" className="font-mono">
            {formatTime(actualTime)}
          </Badge>
        </div>
        {currentPauseTime > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Pause:</span>
            <Badge variant="destructive" className="font-mono">
              {formatTime(currentPauseTime)}
            </Badge>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {status === 'idle' && (
          <Button
            size="sm"
            onClick={handleStart}
            disabled={disabled}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
        )}

        {status === 'running' && (
          <>
            <Button
              size="sm"
              onClick={handlePause}
              disabled={disabled}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={disabled}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete
            </Button>
          </>
        )}

        {status === 'paused' && (
          <>
            <Button
              size="sm"
              onClick={handleResume}
              disabled={disabled}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={disabled}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete
            </Button>
          </>
        )}

        {status === 'completed' && (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </Badge>
        )}

        {/* Status Badge */}
        <Badge
          variant={
            status === 'running' ? 'default' :
            status === 'paused' ? 'secondary' :
            status === 'completed' ? 'outline' :
            'outline'
          }
          className={
            status === 'running' ? 'bg-cyan-600 text-white' :
            status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
            status === 'completed' ? 'bg-green-100 text-green-800' :
            ''
          }
        >
          {status === 'running' ? 'In Progress' :
           status === 'paused' ? 'Paused' :
           status === 'completed' ? 'Completed' :
           'Not Started'}
        </Badge>
      </div>
    </div>
  );
}