import React from "react";
import {
  Chrome,
  Youtube,
  TrendingUp,
  DollarSign,
  BarChart,
  Clock,
  ShoppingBag,
  Trophy,
} from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
import styles from "./HowToPlay.module.css";
import Link from "next/link";

const HowToPlay = () => {
  const steps = [
    {
      icon: <Chrome />,
      title: "Install the Extension",
      description:
        "Add the Chrome extension, pin it to your toolbar for easy access, and start your investing journey.",
    },
    {
      icon: <Youtube />,
      title: "Browse YouTube",
      description:
        "Use YouTube as you normally would. Look for newly uploaded videos or ones gaining momentum fast.",
    },
    {
      icon: <DollarSign />,
      title: "Invest in Videos",
      description:
        "Click the extension, choose your investment amount, and collect a stake in the video you're watching.",
    },
    {
      icon: <TrendingUp />,
      title: "Watch Your Profits",
      description:
        "Monitor your investments as videos gain views. Hold while trending up, sell before it crashes.",
    },
    {
      icon: <BarChart />,
      title: "Manage Risk",
      description:
        "Beware of crashes that can cut your investment. The bigger your gains, the higher the risk.",
    },
    {
      icon: <Clock />,
      title: "Sell for Profit",
      description:
        "Lock in profits by selling at the right time. Higher returns mean longer cooldowns for reinvesting.",
    },
    {
      icon: <Trophy />,
      title: "Climb the Leaderboard",
      description:
        "Compete globally with other players. Basic users get 5 trades daily, Premium users get more benefits.",
    },
    {
      icon: <ShoppingBag />,
      title: "YouCoins Shop (Coming Soon)",
      description:
        "Soon you'll be able to spend your YouCoins on cosmetics, boosts, and special status badges.",
    },
  ];

  return (
    <div className={styles.howToPlay}>
      <div className={styles.howToPlayContainer}>
        <h2 className={styles.howToPlayTitle}>How to Play YouTube Collect</h2>

        <div className={styles.howToPlayGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepCardContent}>
                <div className={styles.stepCardIcon}>{step.icon}</div>
                <div>
                  <h3 className={styles.stepCardTitle}>
                    <span className={styles.stepCardStepNumber}>{index + 1}.</span>{" "}
                    {step.title}
                  </h3>
                  <p className={styles.stepCardDescription}>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
        
<Link href={`https://chromewebstore.google.com/detail/cffeplhkppfdbameoggalnjjjklekffp?utm_source=item-share-cb`} passHref legacyBehavior>
            <button className={styles.ctaButton}>Start Collecting Now</button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
