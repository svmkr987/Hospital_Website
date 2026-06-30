import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle, Clock } from 'lucide-react';

export default function BookAppointment() {
  const [formData, setFormData] = useState({ patientName: '', email: '', phone: '', reason: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate next 14 days
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      
      const fullDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      arr.push({
        fullDateStr,
        month: months[d.getMonth()],
        dateNum: d.getDate(),
        dayLabel: isToday ? 'Tdy' : isTomorrow ? 'Tmw' : days[d.getDay()],
        isSunday: d.getDay() === 0,
        originalDate: d
      });
    }
    return arr;
  }, []);

  const [selectedDateObj, setSelectedDateObj] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  React.useEffect(() => {
    if (!selectedDateObj) return;
    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(`/api/appointments/booked?date=${selectedDateObj.fullDateStr}`);
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(data);
        }
      } catch (err) {
        console.error('Failed to fetch booked slots', err);
      }
    };
    fetchBookedSlots();
  }, [selectedDateObj]);

  // Generate time slots in 15 min intervals starting from 10:30
  const timeSlots = useMemo(() => {
    if (!selectedDateObj) return { Morning: [], Afternoon: [], Evening: [] };
    const slots: { Morning: any[], Afternoon: any[], Evening: any[] } = { Morning: [], Afternoon: [], Evening: [] };
    
    let currentHours = 10;
    let currentMins = 30;
    const endHours = selectedDateObj.isSunday ? 16 : 21; // Sun ends at 4 PM, Mon-Sat ends at 9 PM

    const now = new Date();
    const isToday = selectedDateObj.fullDateStr === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTotalMins = now.getHours() * 60 + now.getMinutes();

    while (currentHours < endHours || (currentHours === endHours && currentMins === 0)) {
      const slotTotalMins = currentHours * 60 + currentMins;
      
      // Filter out past times if today
      if (!isToday || slotTotalMins > currentTotalMins) {
        const period = currentHours >= 12 ? 'PM' : 'AM';
        const displayHours = currentHours > 12 ? currentHours - 12 : currentHours;
        const displayMins = currentMins.toString().padStart(2, '0');
        const timeStr = `${displayHours}:${displayMins} ${period}`;
        const timeValue = `${currentHours.toString().padStart(2, '0')}:${currentMins.toString().padStart(2, '0')}`;

        if (currentHours < 12) {
          slots.Morning.push({ label: timeStr, value: timeValue });
        } else if (currentHours < 17) {
          slots.Afternoon.push({ label: timeStr, value: timeValue });
        } else {
          slots.Evening.push({ label: timeStr, value: timeValue });
        }
      }

      currentMins += 15;
      if (currentMins >= 60) {
        currentHours++;
        currentMins = 0;
      }
    }
    return slots;
  }, [selectedDateObj]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!selectedTime) {
      setErrorMsg('Please select an appointment time.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/appointments/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          date: selectedDateObj.fullDateStr, 
          time: selectedTime 
        })
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const errData = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(`Failed to submit request. ${errData.error || errData.details || res.statusText}`);
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-mint font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-green hover:text-green/80 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-[40px] shadow-sm border border-sage overflow-hidden">
          {status === 'success' ? (
            <div className="p-12 text-center text-green flex flex-col items-center">
              <CheckCircle className="w-20 h-20 mb-6" />
              <h3 className="text-3xl font-bold font-display text-slate">Booking Requested!</h3>
              <p className="mt-4 text-slate/80 text-lg max-w-md">We have received your appointment request. Our reception team will contact you shortly to confirm.</p>
              <Link to="/" className="mt-10 px-8 py-4 bg-green text-white rounded-full font-bold hover:bg-green/90 transition-colors">
                Return to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-8 md:p-10 border-b border-sage/50 bg-mint/10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green shadow-sm border border-sage shrink-0">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-display font-bold text-slate">In-Clinic Consultation</h1>
                      <p className="text-slate/70 text-sm mt-1">Dr. Samskar . | Shubham Clinic, Balagere</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate/60 text-left md:text-right">
                    {selectedDateObj && selectedTime ? (
                      <p>Selected: <span className="font-bold text-slate">{selectedDateObj.dayLabel}, {selectedDateObj.month} {selectedDateObj.dateNum}</span> at <span className="font-bold text-slate">{selectedTime}</span></p>
                    ) : (
                      <p>Please select a date and time to proceed.</p>
                    )}
                    <p className="mt-2 text-slate font-medium">Doctor's Consultation Fee: <span className="font-bold text-green text-base">₹350</span></p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 grid md:grid-cols-2 gap-12">
                {/* Left Col: Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-display text-slate flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-mint text-green flex items-center justify-center text-xs">1</span>
                    Patient Details
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">Patient Name <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all" placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all" placeholder="10-digit mobile number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">Email <span className="text-slate/50 font-normal">(Optional)</span></label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all" placeholder="For booking confirmation" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">Reason for Visit <span className="text-slate/50 font-normal">(Optional)</span></label>
                    <textarea rows={3} value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-sage/50 bg-mint/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all resize-none" placeholder="Briefly describe your symptoms..."></textarea>
                  </div>
                </div>

                {/* Right Col: Date & Time */}
                <div className="space-y-8">
                  <h3 className="text-lg font-bold font-display text-slate flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-mint text-green flex items-center justify-center text-xs">2</span>
                    Select Date & Time <span className="text-red-500">*</span>
                  </h3>
                  
                  {/* Date Selector */}
                  <div className="bg-white rounded-2xl border border-sage/50 p-2">
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {dates.map(d => {
                        const isSelected = selectedDateObj.fullDateStr === d.fullDateStr;
                        return (
                          <button
                            key={d.fullDateStr}
                            type="button"
                            onClick={() => { setSelectedDateObj(d); setSelectedTime(''); }}
                            className={`flex flex-col items-center min-w-[72px] p-3 rounded-xl border transition-all snap-start ${
                              isSelected
                                ? 'bg-green border-green text-white shadow-md shadow-green/20'
                                : 'bg-transparent border-transparent text-slate hover:bg-mint/50 hover:border-sage'
                            }`}
                          >
                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-white/90' : 'text-slate/50'}`}>{d.month}</span>
                            <span className="text-2xl font-display font-bold mb-1 leading-none">{d.dateNum}</span>
                            <span className={`text-[11px] font-medium ${isSelected ? 'text-white/90' : 'text-slate/60'}`}>{d.dayLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-6 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {timeSlots.Morning.length === 0 && timeSlots.Afternoon.length === 0 && timeSlots.Evening.length === 0 && (
                      <div className="text-center py-8 text-slate/50 bg-mint/20 rounded-2xl border border-sage/50">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>No more slots available today.</p>
                      </div>
                    )}

                    {['Morning', 'Afternoon', 'Evening'].map(period => {
                      const slots = timeSlots[period as keyof typeof timeSlots];
                      if (slots.length === 0) return null;
                      return (
                        <div key={period}>
                          <h4 className="text-xs font-bold text-slate/40 uppercase tracking-widest mb-3">{period}</h4>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {slots.map(slot => {
                              const isSelected = selectedTime === slot.value;
                              const isBooked = bookedSlots.includes(slot.value);
                              return (
                                <button
                                  key={slot.value}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => { setSelectedTime(slot.value); setErrorMsg(''); }}
                                  className={`py-2.5 px-2 rounded-xl border text-sm font-bold transition-all ${
                                    isBooked
                                      ? 'bg-slate/5 border-slate/10 text-slate/30 cursor-not-allowed'
                                      : isSelected
                                        ? 'bg-green border-green text-white shadow-sm shadow-green/20'
                                        : 'bg-white border-sage/50 text-slate hover:border-green hover:text-green'
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 md:p-10 border-t border-sage/50 bg-mint/10 flex flex-col sm:flex-row items-center justify-end gap-6">
                <div className="w-full sm:w-auto flex flex-col items-end">
                  <button 
                    disabled={status === 'submitting' || !selectedTime} 
                    type="submit" 
                    className="w-full sm:w-auto px-8 py-4 bg-green text-white rounded-xl font-bold hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green/20 flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? 'Processing...' : 'Book Appointment'}
                  </button>
                  {errorMsg && <p className="text-red-500 text-sm mt-2 font-medium">{errorMsg}</p>}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

