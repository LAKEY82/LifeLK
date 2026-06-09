import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { fetchHolidays } from '../services/api';
import MetricCard from './MetricCard';

export default function HolidayWidget() {
  const [holidays, setHolidays] = useState([]);
  const [nextHoliday, setNextHoliday] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const loadHolidays = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHolidays();

      const sortedData = data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setHolidays(sortedData);
      findNextHoliday(sortedData);

    } catch (err) {
      setError('Unable to load holiday calendar.');
    } finally {
      setLoading(false);
    }
  };


  const findNextHoliday = (holidayList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = holidayList.find((holiday) => {
      const holidayDate = new Date(holiday.date);
      holidayDate.setHours(0, 0, 0, 0);

      return holidayDate >= today;
    });

    setNextHoliday(upcoming || null);
  };


  useEffect(() => {
    loadHolidays();
  }, []);


  // Countdown
  useEffect(() => {
    if (!nextHoliday) return;


    const timer = setInterval(() => {

      const now = new Date().getTime();

      const target = new Date(
        nextHoliday.date + 'T00:00:00'
      ).getTime();


      const diff = target - now;


      if (diff <= 0) {

        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });

        clearInterval(timer);

      } else {

        const days = Math.floor(
          diff / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
        );

        const minutes = Math.floor(
          (diff % (1000 * 60 * 60)) /
          (1000 * 60)
        );

        const seconds = Math.floor(
          (diff % (1000 * 60)) / 1000
        );


        setCountdown({
          days,
          hours,
          minutes,
          seconds
        });
      }

    }, 1000);


    return () => clearInterval(timer);

  }, [nextHoliday]);



  const formatDate = (dateStr) => {
    const options = {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    };

    return new Date(dateStr).toLocaleDateString(
      'en-US',
      options
    );
  };


  const upcomingHolidays = holidays
    .filter((holiday) => {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const holidayDate = new Date(holiday.date);
      holidayDate.setHours(0, 0, 0, 0);

      return holidayDate >= today;

    })
    .slice(0, 8);



  return (
    <MetricCard
      title="Public Holidays LK"
      icon={Calendar}
      loading={loading}
      error={error}
      onRetry={loadHolidays}
    >

      <div className="flex flex-col h-full gap-4">


        {/* Countdown */}
        {nextHoliday && (

          <div className="
            p-4 rounded-2xl
            bg-gradient-to-br from-amber-500/10 to-amber-600/5
            dark:bg-slate-900/35
            border border-amber-500/15
            flex flex-col items-center
            text-center relative overflow-hidden
          ">


            <span className="
              text-[9px]
              uppercase tracking-wider
              text-amber-500
              font-extrabold
              flex items-center gap-1.5
            ">

              <Clock className="h-3 w-3 animate-pulse" />

              Next Holiday Countdown

            </span>



            <h4 className="
              text-xs font-bold
              text-slate-100
              light-mode:text-slate-800
            ">
              {nextHoliday.name}
            </h4>



            <span className="
              text-[10px]
              text-slate-400
              light-mode:text-slate-500
            ">

              {formatDate(nextHoliday.date)}
              {' • '}
              {nextHoliday.type}

            </span>



            <div className="
              grid grid-cols-4 gap-2.5 mt-3
              max-w-[200px] w-full
            ">


              {[
                { val: countdown.days, label: 'days' },
                { val: countdown.hours, label: 'hrs' },
                { val: countdown.minutes, label: 'mins' },
                { val: countdown.seconds, label: 'secs' }

              ].map((item, index) => (


                <div
                  key={index}
                  className="
                    flex flex-col
                    p-1.5 rounded-lg
                    bg-slate-950/60
                    border border-slate-900
                  "
                >

                  <span className="
                    font-bold text-sm
                    text-amber-400
                  ">
                    {String(item.val).padStart(2, '0')}
                  </span>


                  <span className="
                    text-[8px]
                    text-slate-500
                    uppercase
                  ">
                    {item.label}
                  </span>


                </div>

              ))}


            </div>


          </div>

        )}





        {/* Holiday List */}

        <div className="flex-1 flex flex-col gap-2">


          <span className="
            text-[10px]
            text-slate-500
            uppercase
            font-bold
          ">
            Upcoming Holidays
          </span>



          <div className="
            flex-1
            max-h-[160px]
            overflow-y-auto
            space-y-2
          ">


            {upcomingHolidays.length > 0 ? (


              upcomingHolidays.map((holiday, index) => (


                <div

                  key={index}

                  className={`
                    flex items-center justify-between
                    p-2.5 rounded-xl border text-xs

                    ${nextHoliday?.date === holiday.date

                      ?
                      'bg-amber-500/5 border-amber-500/20 text-amber-400'

                      :

                      'bg-slate-900/10 border-slate-900/40 text-slate-300'
                    }
                  `}

                >


                  <div className="flex flex-col">

                    <span className="
                      font-bold text-[11px]
                    ">

                      {holiday.name}

                    </span>


                    <span className="
                      text-[9px]
                      text-slate-500
                    ">

                      {formatDate(holiday.date)}
                      {' • '}
                      {holiday.type}

                    </span>


                  </div>



                  {holiday.public && (

                    <span className="
                      text-[8px]
                      px-1.5 py-0.5
                      rounded-md
                      bg-teal-500/10
                      text-teal-400
                    ">

                      Public

                    </span>

                  )}


                </div>


              ))


            ) : (


              <span className="
                text-slate-500
                text-xs
                text-center
              ">

                No remaining holidays this year.

              </span>


            )}


          </div>


        </div>


      </div>


    </MetricCard>
  );
}