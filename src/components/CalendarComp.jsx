import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'react-date-range';
import format from 'date-fns/format';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const CalendarComp = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  useEffect(() => {
    const hideOnEscape = (e) => e.key === 'Escape' && setOpen(false);
    const hideOnClickOutside = (e) => {
      if (refOne.current && !refOne.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', hideOnEscape);
    document.addEventListener('click', hideOnClickOutside, true);
    return () => {
      document.removeEventListener('keydown', hideOnEscape);
      document.removeEventListener('click', hideOnClickOutside, true);
    };
  }, []);

  const handleSelect = (selectedDate) => {
    onChange(selectedDate);
    setOpen(false);
  };

  return (
    <div className="calendarWrap" style={{ position: 'relative', zIndex: 1000 }}>
  <input
    value={format(value, 'yyyy-MM-dd')}
    readOnly
    className={`inputBox form-control ${!value || error ? 'is-invalid' : ''}`}
    onClick={() => setOpen(!open)}
    style={{ cursor: 'pointer' }}
  />
  {open && (
    <div 
      ref={refOne}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 2000, 
        background: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        marginTop: '8px'
      }}
    >
      <Calendar
        date={value}
        onChange={handleSelect}
        className="calendarElement"
      />
    </div>
  )}
</div>
  );
};

export default CalendarComp;