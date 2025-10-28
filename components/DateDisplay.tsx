import React from 'react';

interface DateDisplayProps {
  date: string;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  const dateObj = new Date(date);
  const displayDate = dateObj.toISOString().split('T')[0];

  return (
    <span className="font-mono text-sm text-light-gray" title={dateObj.toLocaleString()}>
      {displayDate}
    </span>
  );
};

export default DateDisplay;
