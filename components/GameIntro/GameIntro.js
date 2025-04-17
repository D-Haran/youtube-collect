import React from "react";
import { CircleDollarSign, TrendingUp, Award } from "lucide-react";
import styles from './GameIntro.module.css';

const GameIntro = () => {
  return (
    <div className={styles.introSection}>
      <h2 className={styles.introTitle}>Predict the Next Viral Hit</h2>
      <p className={styles.introDescription}>
        YouTube Collect is a browser game where you invest in real YouTube videos like stocks and try to predict what will go viral!
      </p>
      
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <div className={styles.featureIconBg}>
              <CircleDollarSign size={28} />
            </div>
          </div>
          <h3 className={styles.featureTitle}>Start With 100 YouCoins</h3>
          <p className={styles.featureDescription}>Begin your journey with 100 YouCoins and make strategic investments in videos</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <div className={styles.featureIconBg}>
              <TrendingUp size={28} />
            </div>
          </div>
          <h3 className={styles.featureTitle}>Grow Your Portfolio</h3>
          <p className={styles.featureDescription}>Invest in videos early and sell when views increase to earn profits</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <div className={styles.featureIconBg}>
              <Award size={28} />
            </div>
          </div>
          <h3 className={styles.featureTitle}>Top The Leaderboard</h3>
          <p className={styles.featureDescription}>Compete with others to reach #1 on the global leaderboard</p>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;
