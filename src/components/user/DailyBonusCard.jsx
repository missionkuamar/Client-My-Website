import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDailyBonusStatus,
  claimDailyBonus,
} from "../../features/user/userSlice";
import { updateStars } from "../../features/auth/authSlice";
import { Gift, Star, Flame, Clock, Check, Zap } from "lucide-react";
import toast from "react-hot-toast";

/* ---------- Countdown Timer ---------- */
const CountdownTimer = ({ seconds, onComplete }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const t = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(t);
          onComplete?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [remaining, onComplete]);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <span className="font-mono text-sm font-bold text-gray-800">
      {String(h).padStart(2, "0")}:
      {String(m).padStart(2, "0")}:
      {String(s).padStart(2, "0")}
    </span>
  );
};

const DailyBonusCard = () => {
  const dispatch = useDispatch();
  const { dailyBonus, dailyBonusLoading, claiming } = useSelector(
    (s) => s.user
  );
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchDailyBonusStatus());
  }, [dispatch]);

  const handleClaim = async () => {
    try {
      const res = await dispatch(claimDailyBonus()).unwrap();
      // Update user stars in auth slice
      dispatch(updateStars(res.newBalance));
      toast.success(res.message, { duration: 4000 });
      dispatch(fetchDailyBonusStatus());
    } catch (err) {
      toast.error(err || "Claim failed");
    }
  };

  const handleTimerComplete = () => {
    dispatch(fetchDailyBonusStatus());
  };

  if (dailyBonusLoading && !dailyBonus.currentStars) {
    return (
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 shadow-lg animate-pulse">
        <div className="h-20 bg-white/20 rounded"></div>
      </div>
    );
  }

  /* ==================== CAN CLAIM ==================== */
  if (dailyBonus.canClaim) {
    return (
      <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-2xl p-5 sm:p-6 shadow-lg overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 shadow-lg animate-bounce">
            <Gift size={32} className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider">
                Daily Bonus
              </p>
              <span className="text-[10px] bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded-full font-bold">
                READY!
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              +{dailyBonus.dailyReward} Free Stars!
              <Star
                size={20}
                className="fill-white text-white"
              />
            </h3>

            {dailyBonus.streak > 0 && (
              <p className="text-xs text-white/90 mt-1 flex items-center gap-1">
                <Flame size={12} /> {dailyBonus.streak} day streak
              </p>
            )}
          </div>

          {/* Claim Button */}
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full sm:w-auto px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-yellow-50 transition shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {claiming ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></span>
                Claiming...
              </>
            ) : (
              <>
                <Zap size={18} /> Claim Now
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  /* ==================== ALREADY CLAIMED ==================== */
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
          <Check size={26} className="text-green-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Daily Bonus
          </p>

          <h3 className="text-lg font-bold text-gray-800">
            Claimed for today! ✅
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
            {dailyBonus.streak > 0 && (
              <span className="flex items-center gap-1">
                <Flame size={12} className="text-orange-500" />
                {dailyBonus.streak} day streak
              </span>
            )}
            <span className="flex items-center gap-1">
              Total claimed: <strong>{dailyBonus.totalClaims}</strong>
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Next reward in
          </p>
          <CountdownTimer
            seconds={dailyBonus.timeRemaining}
            onComplete={handleTimerComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyBonusCard;