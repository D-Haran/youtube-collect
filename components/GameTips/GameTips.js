import React from "react";
import { Clock, TrendingDown, LayoutGrid, Lightbulb } from "lucide-react";
import styles from './GameTips.module.css';

const GameTips = () => {
  const tips = [
    {
      icon: <Clock size={24} />,
      title: "Time Your Entry",
      description: "Videos under 30 minutes old offer the best potential returns. Early bird gets the profit!"
    },
    {
      icon: <TrendingDown size={24} />,
      title: "Don't Get Greedy",
      description: "Know when to sell. Market crashes are real and can quickly slash your hard-earned profits."
    },
    {
      icon: <LayoutGrid size={24} />,
      title: "Diversify Investments",
      description: "Spread your risk by investing in multiple videos across different channels and categories."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Trust Your Instinct",
      description: "Watch YouTube normally and let your natural intuition guide your investment decisions."
    }
  ];

  return (
    <div className={styles.tipsSection}>
      <div className={styles.tipsContainer}>
        <h2 className={styles.tipsTitle}>Pro Tips for New Collectors</h2>
        
        <div className={styles.tipsGrid}>
          {tips.map((tip, index) => (
            <div key={index} className={styles.tipCard}>
              <div className={styles.tipContent}>
                <div className={styles.tipIcon}>
                  {tip.icon}
                </div>
                <div>
                  <h3 className={styles.tipTitle}>{tip.title}</h3>
                  <p className={styles.tipDescription}>{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameTips;
