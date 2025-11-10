"use client";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import MUITypography from "@/components/Typography";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <LocaleSwitcher />

      <article className="max-w-3xl space-y-6">
        <MUITypography variant="h1" component="h1" i18nKey="article.title">
          The Ultimate Productivity Hack is Saying No
        </MUITypography>

        <MUITypography
          variant="subtitle1"
          component="p"
          i18nKey="article.author"
        >
          written by James Clear
        </MUITypography>

        <MUITypography
          variant="subtitle2"
          component="p"
          i18nKey="article.categories"
        >
          Decision Making Focus Life Lessons
        </MUITypography>

        <MUITypography variant="h2" component="h2" i18nKey="article.subtitle">
          The ultimate productivity hack is saying no.
        </MUITypography>

        <MUITypography variant="body1" component="p" i18nKey="article.para1">
          Not doing something will always be faster than doing it. This
          statement reminds me of the old computer programming saying, "Remember
          that there is no code faster than no code."
        </MUITypography>

        <MUITypography variant="body1" component="p" i18nKey="article.para2">
          The same philosophy applies in other areas of life. For example, there
          is no meeting that goes faster than not having a meeting at all.
        </MUITypography>

        <MUITypography variant="body1" component="p" i18nKey="article.para3">
          This is not to say you should never attend another meeting, but the
          truth is that we say yes to many things we don't actually want to do.
          There are many meetings held that don't need to be held. There is a
          lot of code written that could be deleted.
        </MUITypography>

        <MUITypography variant="body1" component="p" i18nKey="article.para4">
          How often do people ask you to do something and you just reply, "Sure
          thing." Three days later, you're overwhelmed by how much is on your
          to-do list. We become frustrated by our obligations even though we
          were the ones who said yes to them in the first place.
        </MUITypography>

        <MUITypography variant="body1" component="p" i18nKey="article.para5">
          It's worth asking if things are necessary. Many of them are not, and a
          simple "no" will be more productive than whatever work the most
          efficient person can muster.
        </MUITypography>

        <MUITypography variant="body1" component="p" i18nKey="article.para6">
          But if the benefits of saying no are so obvious, then why do we say
          yes so often?
        </MUITypography>

        <MUITypography
          variant="h3"
          component="h3"
          i18nKey="article.section1.title"
        >
          Why We Say Yes
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section1.para1"
        >
          We agree to many requests not because we want to do them, but because
          we don't want to be seen as rude, arrogant, or unhelpful. Often, you
          have to consider saying no to someone you will interact with again in
          the future—your co-worker, your spouse, your family and friends.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section1.para2"
        >
          Saying no to these people can be particularly difficult because we
          like them and want to support them. (Not to mention, we often need
          their help too.) Collaborating with others is an important element of
          life. The thought of straining the relationship outweighs the
          commitment of our time and energy.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section1.para3"
        >
          For this reason, it can be helpful to be gracious in your response. Do
          whatever favors you can, and be warm-hearted and direct when you have
          to say no.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section1.para4"
        >
          But even after we have accounted for these social considerations, many
          of us still seem to do a poor job of managing the tradeoff between yes
          and no. We find ourselves over-committed to things that don't
          meaningfully improve or support those around us, and certainly don't
          improve our own lives.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section1.para5"
        >
          Perhaps one issue is how we think about the meaning of yes and no.
        </MUITypography>

        <MUITypography
          variant="h3"
          component="h3"
          i18nKey="article.section2.title"
        >
          The Difference Between Yes and No
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section2.para1"
        >
          The words "yes" and "no" get used in comparison to each other so often
          that it feels like they carry equal weight in conversation. In
          reality, they are not just opposite in meaning, but of entirely
          different magnitudes in commitment.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section2.para2"
        >
          When you say no, you are only saying no to one option. When you say
          yes, you are saying no to every other option.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section2.para3"
        >
          I like how the economist Tim Harford put it, "Every time we say yes to
          a request, we are also saying no to anything else we might accomplish
          with the time." Once you have committed to something, you have already
          decided how that future block of time will be spent.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section2.para4"
        >
          In other words, saying no saves you time in the future. Saying yes
          costs you time in the future. No is a form of time credit. You retain
          the ability to spend your future time however you want. Yes is a form
          of time debt. You have to pay back your commitment at some point.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section2.para5"
        >
          No is a decision. Yes is a responsibility.
        </MUITypography>

        <MUITypography
          variant="h3"
          component="h3"
          i18nKey="article.section3.title"
        >
          The Role of No
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section3.para1"
        >
          Saying no is sometimes seen as a luxury that only those in power can
          afford. And it is true: turning down opportunities is easier when you
          can fall back on the safety net provided by power, money, and
          authority. But it is also true that saying no is not merely a
          privilege reserved for the successful among us. It is also a strategy
          that can help you become successful.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section3.para2"
        >
          Saying no is an important skill to develop at any stage of your career
          because it retains the most important asset in life: your time. As the
          investor Pedro Sorrentino put it, "If you don't guard your time,
          people will steal it from you."
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section3.para3"
        >
          You need to say no to whatever isn't leading you toward your goals.
          You need to say no to distractions. As one reader told me, "If you
          broaden the definition as to how you apply no, it actually is the only
          productivity hack (as you ultimately say no to any distraction in
          order to be productive)."
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section3.para4"
        >
          Nobody embodied this idea better than Steve Jobs, who said, "People
          think focus means saying yes to the thing you've got to focus on. But
          that's not what it means at all. It means saying no to the hundred
          other good ideas that there are. You have to pick carefully."
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section3.para5"
        >
          There is an important balance to strike here. Saying no doesn't mean
          you'll never do anything interesting or innovative or spontaneous. It
          just means that you say yes in a focused way. Once you have knocked
          out the distractions, it can make sense to say yes to any opportunity
          that could potentially move you in the right direction. You may have
          to try many things to discover what works and what you enjoy. This
          period of exploration can be particularly important at the beginning
          of a project, job, or career.
        </MUITypography>

        <MUITypography
          variant="h3"
          component="h3"
          i18nKey="article.section4.title"
        >
          Upgrading Your No
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section4.para1"
        >
          Over time, as you continue to improve and succeed, your strategy needs
          to change.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section4.para2"
        >
          The opportunity cost of your time increases as you become more
          successful. At first, you just eliminate the obvious distractions and
          explore the rest. As your skills improve and you learn to separate
          what works from what doesn't, you have to continually increase your
          threshold for saying yes.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section4.para3"
        >
          You still need to say no to distractions, but you also need to learn
          to say no to opportunities that were previously good uses of time, so
          you can make space for great uses of time. It's a good problem to
          have, but it can be a tough skill to master.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section4.para4"
        >
          In other words, you have to upgrade your "no's" over time.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section4.para5"
        >
          Upgrading your no doesn't mean you'll never say yes. It just means you
          default to saying no and only say yes when it really makes sense. To
          quote the investor Brent Beshore, "Saying no is so powerful because it
          preserves the opportunity to say yes."
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section4.para6"
        >
          The general trend seems to be something like this: If you can learn to
          say no to bad distractions, then eventually you'll earn the right to
          say no to good opportunities.
        </MUITypography>

        <MUITypography
          variant="h3"
          component="h3"
          i18nKey="article.section5.title"
        >
          How to Say No
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section5.para1"
        >
          Most of us are probably too quick to say yes and too slow to say no.
          It's worth asking yourself where you fall on that spectrum.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section5.para2"
        >
          If you have trouble saying no, you may find the following strategy
          proposed by Tim Harford, the British economist I mentioned earlier, to
          be helpful. He writes, "One trick is to ask, "If I had to do this
          today, would I agree to it?" It's not a bad rule of thumb, since any
          future commitment, no matter how far away it might be, will eventually
          become an imminent problem."
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section5.para3"
        >
          If an opportunity is exciting enough to drop whatever you're doing
          right now, then it's a yes. If it's not, then perhaps you should think
          twice.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section5.para4"
        >
          This is similar to the well-known "Hell Yeah or No" method from Derek
          Sivers. If someone asks you to do something and your first reaction is
          "Hell Yeah!", then do it. If it doesn't excite you, then say no.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section5.para5"
        >
          It's impossible to remember to ask yourself these questions each time
          you face a decision, but it's still a useful exercise to revisit from
          time to time. Saying no can be difficult, but it is often easier than
          the alternative. As writer Mike Dariano has pointed out, "It's easier
          to avoid commitments than get out of commitments. Saying no keeps you
          toward the easier end of this spectrum."
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section5.para6"
        >
          What is true about health is also true about productivity: an ounce of
          prevention is worth a pound of cure.
        </MUITypography>

        <MUITypography
          variant="h3"
          component="h3"
          i18nKey="article.section6.title"
        >
          The Power of No
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section6.para1"
        >
          More effort is wasted doing things that don't matter than is wasted
          doing things inefficiently. And if that is the case, elimination is a
          more useful skill than optimization.
        </MUITypography>

        <MUITypography
          variant="body1"
          component="p"
          i18nKey="article.section6.para2"
        >
          I am reminded of the famous Peter Drucker quote, "There is nothing so
          useless as doing efficiently that which should not be done at all."
        </MUITypography>
      </article>
    </div>
  );
}
