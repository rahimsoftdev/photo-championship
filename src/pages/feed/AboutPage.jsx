import AboutBanner from "../../components/feed/about/AboutBanner";
import AboutCallToAction from "../../components/feed/about/AboutCallToAction";
import AboutMissionVision from "../../components/feed/about/AboutMissionVision";
import AboutStats from "../../components/feed/about/AboutStats";
import AboutStory from "../../components/feed/about/AboutStory";
import CommunitySection from "../../components/feed/about/CommunitySection";
import HowCompetitionsWork from "../../components/feed/about/HowCompetitionsWork";

const AboutPage = () => {
    return (
        <>
            <AboutBanner />
            <AboutStats />
            <AboutStory />
            <AboutMissionVision />
            <HowCompetitionsWork />
            <CommunitySection/>
            <AboutCallToAction />
        </>
    );
};

export default AboutPage;