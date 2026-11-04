import { motion } from 'framer-motion';

interface TarotRevealCardProps {
  isRevealed: boolean;
  onReveal: () => void;
  cardName?: string;
  cardImage?: string;
  isReversed?: boolean;
}

export function TarotRevealCard({ 
  isRevealed, 
  onReveal, 
  cardName = 'کارت شما', 
  cardImage,
  isReversed = false 
}: TarotRevealCardProps) {
  const baseUrl = import.meta.env.BASE_URL;
  const backImage = `${baseUrl}assets/tarot/cards/back.webp`;
  const frontImage = cardImage ? `${baseUrl}assets/tarot/cards/${cardImage}` : backImage;

  return (
    <div className="w-full flex justify-center py-4">
      <div 
        className="w-48 h-80 perspective-1000 cursor-pointer relative"
        onClick={onReveal}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isRevealed ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/30 shadow-2xl">
            <img
              src={backImage}
              alt="پشت کارت"
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/30 shadow-2xl rotate-y-180 bg-[var(--luma-bg-card)] flex flex-col items-center justify-center ${isReversed ? 'rotate-180' : ''}`}>
            {cardImage ? (
              <img
                src={frontImage}
                alt={cardName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[var(--luma-gold)] text-sm text-center px-4">
                {cardName}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
