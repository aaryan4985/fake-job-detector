import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultCard = ({ result }) => {
  if (!result) return null;

  const { is_fake, confidence, reasons } = result;

  const isFake = is_fake;
  const statusColor = isFake ? 'text-red-500' : 'text-emerald-500';
  const bgColor = isFake ? 'bg-red-500/10' : 'bg-emerald-500/10';
  const borderColor = isFake ? 'border-red-500/20' : 'border-emerald-500/20';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-6 border-2 ${borderColor} ${bgColor} relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        {isFake ? <XCircle className="w-48 h-48" /> : <CheckCircle className="w-48 h-48" />}
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-6">
          {isFake ? <XCircle className={`w-12 h-12 ${statusColor}`} /> : <CheckCircle className={`w-12 h-12 ${statusColor}`} />}
          <div>
            <h3 className={`text-3xl font-black tracking-tight ${statusColor}`}>
              {isFake ? 'FAKE JOB DETECTED' : 'REAL JOB LIKELY'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">
              Confidence Score: <span className="font-bold">{confidence}%</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 dark:bg-dark-900 rounded-full overflow-hidden mb-8">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${isFake ? 'bg-red-500' : 'bg-emerald-500'}`}
          />
        </div>

        {reasons && reasons.length > 0 ? (
          <div className="bg-white/50 dark:bg-dark-900/50 rounded-xl p-5 backdrop-blur-sm border border-black/5 dark:border-white/5">
            <h4 className="flex items-center font-bold text-gray-800 dark:text-gray-200 mb-4">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Flags & Analysis Factors
            </h4>
            <ul className="space-y-3">
              {reasons.map((reason, idx) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} className="flex items-start"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white/50 dark:bg-dark-900/50 rounded-xl p-5 backdrop-blur-sm border border-black/5 dark:border-white/5">
            <h4 className="flex items-center font-bold text-gray-800 dark:text-gray-200">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
              No suspicious patterns detected.
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              The AI model and rule engine did not find significant indicators of fraud.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
