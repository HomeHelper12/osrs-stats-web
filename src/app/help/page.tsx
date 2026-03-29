import Link from "next/link";

const TOC_ITEMS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "your-profile", label: "Your Profile" },
  { id: "skills", label: "Skills Tab" },
  { id: "bosses", label: "Bosses Tab" },
  { id: "collection-log", label: "Collection Log Tab" },
  { id: "quests", label: "Quests Tab" },
  { id: "diaries", label: "Achievement Diaries Tab" },
  { id: "combat-achievements", label: "Combat Achievements Tab" },
  { id: "tasks", label: "Task System" },
  { id: "activity", label: "Activity Feed" },
  { id: "data-sync", label: "How Data Syncs" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "faq", label: "FAQ" },
];

export default function HelpPage() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight text-osrs-gold">
          Help &amp; Documentation
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Everything you need to know about OSRS Stats
        </p>
      </div>

      {/* Table of Contents */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-osrs-gold mb-4">
          Table of Contents
        </h2>
        <nav>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-decimal list-inside">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-gray-300 hover:text-osrs-gold transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* ── Getting Started ── */}
      <section id="getting-started" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Getting Started</h2>

        <div className="space-y-3 text-gray-300">
          <h3 className="text-lg font-semibold text-gray-100">
            What is OSRS Stats?
          </h3>
          <p>
            OSRS Stats is a companion plugin and website that tracks your entire
            Old School RuneScape account in one place. It monitors and displays:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>All 24 skills including Sailing — levels, XP, and ranks</li>
            <li>Boss kill counts and personal best times</li>
            <li>
              Your full Collection Log with item-level detail and obtained status
            </li>
            <li>Quest completion status and quest points</li>
            <li>Achievement Diary progress across all 12 areas</li>
            <li>Combat Achievement progress across 6 tiers</li>
            <li>
              A unique task system with 960 collection-log-based challenges
            </li>
            <li>Loot drops, deaths, level-ups, and other activity events</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            How to Install
          </h3>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              Download the plugin JAR file from the project&apos;s release page.
            </li>
            <li>
              Open RuneLite and navigate to the <strong>Dev Plugin Manager</strong>{" "}
              (or load via RoeLite if applicable).
            </li>
            <li>
              Sideload the JAR by adding it as an external plugin.
            </li>
            <li>
              Restart RuneLite if prompted.
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            First-Time Setup
          </h3>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              Open the plugin settings and enable <strong>Website sync</strong>{" "}
              (Config &rarr; Website &rarr; Enabled).
            </li>
            <li>Log into Old School RuneScape with the plugin active.</li>
            <li>
              Open your <strong>Collection Log</strong> in-game at least once.
              This triggers a full sync of all your collected items — you do not
              need to browse every individual page.
            </li>
          </ol>
          <p>
            That&apos;s it. Your data will begin uploading automatically. Within
            a minute you can view your profile on the website.
          </p>
        </div>
      </section>

      {/* ── Your Profile ── */}
      <section id="your-profile" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Your Profile</h2>

        <div className="space-y-3 text-gray-300">
          <p>
            Every player who has logged in with the plugin has a public profile
            page. The URL format is:
          </p>
          <div className="glass-light rounded-xl px-4 py-3 font-mono text-sm text-gray-200 break-all">
            osrs-stats-web.vercel.app/profile/<span className="text-osrs-gold">YourName</span>
          </div>
          <p>
            Replace <code className="text-osrs-gold">YourName</code> with your
            in-game display name (spaces and special characters are supported).
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Profile Tabs
          </h3>
          <p>Your profile is organized into the following tabs:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Skills</strong> — All 24 skill levels, XP, and ranks
            </li>
            <li>
              <strong>Bosses</strong> — Boss kill counts, ranks, and personal
              bests
            </li>
            <li>
              <strong>Collection Log</strong> — Every page and item with
              obtained/missing status
            </li>
            <li>
              <strong>Quests</strong> — Quest completion status grouped by
              progress
            </li>
            <li>
              <strong>Diaries</strong> — Achievement Diary completion per area
              and tier
            </li>
            <li>
              <strong>Combat Achievements</strong> — Progress across all 6 tiers
            </li>
            <li>
              <strong>Tasks</strong> — Your collection-log task progress and
              active challenges
            </li>
            <li>
              <strong>Activity</strong> — A feed of recent events and milestones
            </li>
          </ul>
          <p>
            Data updates automatically when you play. The plugin syncs on logout
            and periodically while you are logged in.
          </p>
        </div>
      </section>

      {/* ── Skills Tab ── */}
      <section id="skills" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Skills Tab</h2>

        <div className="space-y-3 text-gray-300">
          <p>
            The Skills tab displays all <strong>24 skills</strong> in Old School
            RuneScape, including the newest skill, Sailing.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Each skill card shows the <strong>skill icon</strong>, current{" "}
              <strong>level</strong>, total <strong>XP</strong>, and your{" "}
              <strong>rank</strong> on the hiscores.
            </li>
            <li>
              Skills at <strong>level 99</strong> receive a distinctive{" "}
              <span className="text-osrs-gold font-semibold">gold glow</span>{" "}
              effect to celebrate the achievement.
            </li>
            <li>
              Your <strong>total level</strong> and{" "}
              <strong>total XP</strong> are displayed at the top of the section.
            </li>
          </ul>
        </div>
      </section>

      {/* ── Bosses Tab ── */}
      <section id="bosses" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Bosses Tab</h2>

        <div className="space-y-3 text-gray-300">
          <p>
            The Bosses tab shows your kill counts for every boss in Old School
            RuneScape.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Bosses are <strong>sorted by kill count</strong> (highest first) so
              your most-fought bosses appear at the top.
            </li>
            <li>
              Each boss card displays the boss <strong>image</strong> (sourced
              from the OSRS Wiki), your <strong>kill count</strong>, your{" "}
              <strong>rank</strong>, and your{" "}
              <strong>personal best time</strong> where applicable.
            </li>
            <li>
              Use the <strong>search bar</strong> to quickly find a specific boss
              by name.
            </li>
          </ul>
        </div>
      </section>

      {/* ── Collection Log Tab ── */}
      <section id="collection-log" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">
          Collection Log Tab
        </h2>

        <div className="space-y-3 text-gray-300">
          <p>
            The Collection Log tab mirrors your in-game Collection Log with full
            item-level detail.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Every collection log <strong>page</strong> is listed, containing
              all items associated with that source.
            </li>
            <li>
              Item icons are loaded from the <strong>RuneLite CDN</strong> and
              rendered with pixelated scaling for an authentic look.
            </li>
            <li>
              <strong>Obtained items</strong> are shown with a{" "}
              <span className="text-green-400 font-semibold">
                green highlight
              </span>
              . Missing items appear <strong>dimmed</strong>.
            </li>
            <li>
              A <strong>progress bar</strong> shows your obtained/total count for
              each page and overall.
            </li>
            <li>
              <strong>Kill counts</strong> are displayed per page where
              applicable (e.g., &quot;Kills: 347&quot;).
            </li>
            <li>
              Use the <strong>search</strong> feature to find specific items or
              pages across your entire log.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            How Collection Log Syncing Works
          </h3>
          <p>
            When you open your Collection Log in-game for the first time with the
            plugin active, it performs a{" "}
            <strong>full sync of all items</strong> — you do not need to manually
            browse every page. After that initial sync, new drops are detected in
            real-time via chat messages (e.g., &quot;New item added to your
            collection log&quot;) and uploaded immediately.
          </p>
        </div>
      </section>

      {/* ── Quests Tab ── */}
      <section id="quests" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Quests Tab</h2>

        <div className="space-y-3 text-gray-300">
          <p>
            The Quests tab displays the completion status of every quest in the
            game.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Quests are grouped by status:{" "}
              <span className="text-green-400 font-semibold">Completed</span>,{" "}
              <span className="text-yellow-400 font-semibold">In Progress</span>
              , and{" "}
              <span className="text-gray-500 font-semibold">Not Started</span>.
            </li>
            <li>
              Your total <strong>quest points</strong> are displayed at the top.
            </li>
            <li>
              Quest data syncs automatically when you complete or start a quest
              while the plugin is active.
            </li>
          </ul>
        </div>
      </section>

      {/* ── Achievement Diaries Tab ── */}
      <section id="diaries" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">
          Achievement Diaries Tab
        </h2>

        <div className="space-y-3 text-gray-300">
          <p>
            The Achievement Diaries tab shows your completion progress across all
            12 diary areas in Gielinor.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>12 areas</strong>: Ardougne, Desert, Falador, Fremennik,
              Kandarin, Karamja, Kourend &amp; Kebos, Lumbridge &amp; Draynor,
              Morytania, Varrock, Western Provinces, and Wilderness.
            </li>
            <li>
              Each area shows completion status for all four tiers:{" "}
              <strong>Easy</strong>, <strong>Medium</strong>,{" "}
              <strong>Hard</strong>, and <strong>Elite</strong>.
            </li>
            <li>
              Completed tiers display a visual{" "}
              <span className="text-green-400 font-semibold">checkmark</span>.
              Incomplete tiers are shown as open.
            </li>
          </ul>
        </div>
      </section>

      {/* ── Combat Achievements Tab ── */}
      <section id="combat-achievements" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">
          Combat Achievements Tab
        </h2>

        <div className="space-y-3 text-gray-300">
          <p>
            The Combat Achievements tab tracks your progress across all 6 Combat
            Achievement tiers.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>6 tiers</strong>: Easy, Medium, Hard, Elite, Master, and
              Grandmaster.
            </li>
            <li>
              Each tier has a <strong>progress bar</strong> showing how many
              achievements you have completed out of the total available.
            </li>
            <li>
              An <strong>overall completion percentage</strong> is displayed at
              the top so you can see your total progress at a glance.
            </li>
          </ul>
        </div>
      </section>

      {/* ── Task System ── */}
      <section id="tasks" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Task System</h2>

        <div className="space-y-3 text-gray-300">
          <h3 className="text-lg font-semibold text-gray-100">
            What is the Task System?
          </h3>
          <p>
            The Task System is a set of <strong>960 collection-log-based challenges</strong>{" "}
            spread across 5 difficulty tiers. Each task requires you to obtain
            specific items in your Collection Log from a particular source.
          </p>
          <div className="glass-light rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-200">
              Tasks per tier:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              <li className="glass-card rounded-lg px-3 py-2 text-center">
                <span className="block text-green-400 font-bold">Easy</span>
                <span className="text-gray-400">179 tasks</span>
              </li>
              <li className="glass-card rounded-lg px-3 py-2 text-center">
                <span className="block text-blue-400 font-bold">Medium</span>
                <span className="text-gray-400">199 tasks</span>
              </li>
              <li className="glass-card rounded-lg px-3 py-2 text-center">
                <span className="block text-yellow-400 font-bold">Hard</span>
                <span className="text-gray-400">227 tasks</span>
              </li>
              <li className="glass-card rounded-lg px-3 py-2 text-center">
                <span className="block text-orange-400 font-bold">Elite</span>
                <span className="text-gray-400">216 tasks</span>
              </li>
              <li className="glass-card rounded-lg px-3 py-2 text-center">
                <span className="block text-red-400 font-bold">Master</span>
                <span className="text-gray-400">139 tasks</span>
              </li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            How Tasks Work
          </h3>
          <p>
            Each task requires you to obtain specific items in your Collection
            Log. For example, &quot;Get 1 unique from Crazy Archaeologist&quot;
            requires any one of the Crazy Archaeologist&apos;s unique drops to
            appear in your log.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Accessing Tasks
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>In-game:</strong> Open your Collection Log, click the
              hamburger menu, and select &quot;Tasks&quot;.
            </li>
            <li>
              <strong>Plugin side panel:</strong> Navigate to the Tasks section
              and use the tier selector to browse tasks by difficulty.
            </li>
            <li>
              <strong>Website:</strong> Go to your profile page and click the
              Tasks tab to view all task progress.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Generating &amp; Managing Tasks
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Generate:</strong> Click &quot;Generate&quot; to receive a
              random unfinished task from your currently selected tier.
            </li>
            <li>
              <strong>Skip:</strong> Click &quot;Skip&quot; to discard your
              current task and get a new one from the same tier.
            </li>
            <li>
              <strong>Auto-generate:</strong> Enable this setting to
              automatically receive the next task when one completes, so you
              always have an active challenge.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Auto-Completion
          </h3>
          <p>
            When you receive a new Collection Log item, the system automatically
            checks whether any of your active tasks are now complete. If a task
            is fulfilled, you will see an <strong>in-game notification popup</strong>{" "}
            confirming the completion. This happens within seconds of receiving
            the drop.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Pre-Existing Items
          </h3>
          <p>
            When you first sync your Collection Log (by opening it in-game), the
            system scans all 960 tasks and{" "}
            <strong>auto-completes any you have already finished</strong> based
            on items you already own. You do not need to re-obtain items.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Tier Progress
          </h3>
          <p>
            Track your completion percentage per tier and overall. Progress is
            visible in the plugin side panel, in-game, and on the website.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Sync Across Devices
          </h3>
          <p>
            Everything is stored in the cloud. Your tasks, progress, and
            collection log items are the same whether you check in-game, in the
            plugin side panel, or on the website. No local storage is used.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Verification Types
          </h3>
          <p>
            Most tasks use <strong>collection-log verification</strong>, meaning
            the system checks whether you have specific items in your log. Some
            tasks use <strong>achievement-diary verification</strong> instead.
            Tasks that cannot be auto-verified display a grayed-out Complete
            button and must be completed through other means.
          </p>
        </div>
      </section>

      {/* ── Activity Feed ── */}
      <section id="activity" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Activity Feed</h2>

        <div className="space-y-3 text-gray-300">
          <p>
            The Activity tab displays a chronological feed of recent events from
            your account.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Level ups</strong> — Skill level milestones with the new
              level reached
            </li>
            <li>
              <strong>Loot drops</strong> — Notable item drops with item name and
              value
            </li>
            <li>
              <strong>Deaths</strong> — Where and how you died
            </li>
            <li>
              <strong>Boss KC milestones</strong> — Kill count achievements for
              bosses
            </li>
            <li>
              <strong>Quest completions</strong> — Quests you have finished
            </li>
            <li>
              <strong>New collection log items</strong> — Items added to your
              Collection Log
            </li>
            <li>
              <strong>Pet drops</strong> — Pet obtainments highlighted with
              special emphasis
            </li>
          </ul>
          <p>
            Each event includes a <strong>timestamp</strong> and uses{" "}
            <strong>event-specific colors</strong> so you can scan the feed at a
            glance.
          </p>
        </div>
      </section>

      {/* ── How Data Syncs ── */}
      <section id="data-sync" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">How Data Syncs</h2>

        <div className="space-y-3 text-gray-300">
          <h3 className="text-lg font-semibold text-gray-100">
            Automatic Uploads
          </h3>
          <p>
            The plugin automatically uploads your data to the server when you{" "}
            <strong>log out</strong> and <strong>periodically while playing</strong>.
            You do not need to manually trigger a sync.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Collection Log Sync
          </h3>
          <p>
            Opening your Collection Log in-game once triggers a{" "}
            <strong>full sync of all items</strong>. After that, subsequent drops
            are detected in real-time via in-game chat messages and uploaded
            immediately.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            Task Verification
          </h3>
          <p>
            Task verification is handled <strong>server-side</strong>. When items
            are synced, the server automatically checks all active tasks. The
            full flow looks like this:
          </p>
          <div className="glass-light rounded-xl p-4">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>You receive a collection log drop in-game.</li>
              <li>The plugin detects the chat message.</li>
              <li>The new item is uploaded to the server.</li>
              <li>The server verifies all active tasks against your updated log.</li>
              <li>If a task is completed, the server notifies the plugin.</li>
              <li>An in-game notification popup appears confirming completion.</li>
            </ol>
            <p className="text-sm text-gray-400 mt-2">
              This entire process happens within seconds.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-100 pt-2">
            No Local Storage
          </h3>
          <p>
            Everything lives in the cloud database. There are no JSON files saved
            on your computer. Your data is accessible from any device through the
            website or the plugin.
          </p>
        </div>
      </section>

      {/* ── Troubleshooting ── */}
      <section id="troubleshooting" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">Troubleshooting</h2>

        <div className="space-y-4 text-gray-300">
          <div className="glass-light rounded-xl p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              &quot;Player not found&quot; on the website
            </h3>
            <p className="text-sm">
              You need to log into Old School RuneScape with the plugin active at
              least once before your profile will appear. The plugin creates your
              profile on first login.
            </p>
          </div>

          <div className="glass-light rounded-xl p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              Tasks not showing
            </h3>
            <p className="text-sm">
              Make sure &quot;Website&quot; is enabled in the plugin settings.
              Navigate to Config &rarr; Website &rarr; Enabled and ensure it is
              toggled on.
            </p>
          </div>

          <div className="glass-light rounded-xl p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              Collection Log shows no items
            </h3>
            <p className="text-sm">
              Open the Collection Log in-game at least once while the plugin is
              active. This triggers the auto-sync that uploads all your items.
              You do not need to browse individual pages.
            </p>
          </div>

          <div className="glass-light rounded-xl p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              Website shows old data
            </h3>
            <p className="text-sm">
              Data syncs on logout and periodically while playing. If the website
              appears stale, try logging out and back in, or wait approximately
              30 seconds for the next periodic sync.
            </p>
          </div>

          <div className="glass-light rounded-xl p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              Task did not auto-complete
            </h3>
            <p className="text-sm">
              The item must appear in your collection log chat message for
              auto-detection to work. If you already had the item before
              installing the plugin, open your Collection Log in-game to trigger
              a full re-sync, which will retroactively complete matching tasks.
            </p>
          </div>

          <div className="glass-light rounded-xl p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              Plugin not showing in RuneLite
            </h3>
            <p className="text-sm">
              Verify the JAR file is properly loaded in the Dev Plugin Manager.
              Ensure you have the correct JAR version and that RuneLite has been
              restarted after adding it.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="glass rounded-2xl p-6 space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-bold text-osrs-gold">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-gray-300">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-100">
              Is this safe to use?
            </h3>
            <p className="text-sm">
              Yes. This is a standard RuneLite plugin. It only reads game data
              such as skill levels, kill counts, and collection log entries. It
              never sends inputs or automates gameplay in any way.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-100">
              Does this work with ironman accounts?
            </h3>
            <p className="text-sm">
              Yes. All account types are fully supported, including regular
              ironman, hardcore ironman, ultimate ironman, and group ironman.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-100">
              Can other people see my profile?
            </h3>
            <p className="text-sm">
              Yes. Profiles are public and accessible at{" "}
              <code className="text-osrs-gold text-xs">
                osrs-stats-web.vercel.app/profile/YourName
              </code>
              . Anyone with the URL can view your stats.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-100">
              How many tasks are there?
            </h3>
            <p className="text-sm">
              960 total across 5 difficulty tiers: Easy (179), Medium (199), Hard
              (227), Elite (216), and Master (139).
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-100">
              Can I reset my task progress?
            </h3>
            <p className="text-sm">
              Not currently through the plugin or website. If you need a task
              reset, contact the plugin developer directly.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-100">
              Does this affect game performance?
            </h3>
            <p className="text-sm">
              No. Data collection is lightweight and runs on separate threads.
              You will not notice any impact on frame rate or game responsiveness.
            </p>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <div className="text-center pb-4">
        <Link
          href="/help"
          className="text-sm text-gray-500 hover:text-osrs-gold transition-colors"
        >
          Back to top
        </Link>
      </div>
    </div>
  );
}
