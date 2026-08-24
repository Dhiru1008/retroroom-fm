"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { songs } from "@/data/songs";

import MusicPlayer from "@/components/MusicPlayer";
import MiniPlayer from "@/components/MiniPlayer";
import Playlist from "@/components/Playlist";
import SearchBar from "@/components/SearchBar";
import LanguageSelector from "@/components/LanguageSelector";

type Song = (typeof songs)[number];

type Theme = {
  name: string;
  emoji: string;
  title: string;
  subtitle: string;
  background: string;
  accent: string;
  accentSoft: string;
  chatTitle: string;
  atmosphere:
    | "rain"
    | "dust"
    | "steam"
    | "film"
    | "lights"
    | "none";
  playerStyle:
    | "vintage"
    | "glass"
    | "cinematic"
    | "neon";
};

const THEMES: Theme[] = [
  {
    name: "Gali Vibes",
    emoji: "🌆",
    title: "गली Vibes",
    subtitle: "Mohalla • Music • Memories",
    background: "/themes/gali-vibes.jpg.png",
    accent: "#F59E0B",
    accentSoft: "rgba(245,158,11,0.16)",
    chatTitle: "गली का Adda",
    atmosphere: "dust",
    playerStyle: "vintage",
  },
  {
    name: "Safar FM",
    emoji: "🚌",
    title: "सफ़र FM",
    subtitle: "Raaste • Gaane • Yaadein",
    background: "/themes/safar-fm.jpg.png",
    accent: "#F97316",
    accentSoft: "rgba(249,115,22,0.16)",
    chatTitle: "Safar Ka Adda",
    atmosphere: "lights",
    playerStyle: "cinematic",
  },
  {
    name: "Desi Dhamaka",
    emoji: "🔥",
    title: "देसी Dhamaka",
    subtitle: "Desi Beats • Full Masti",
    background: "/themes/desi-dhamaka.jpg.png",
    accent: "#EF4444",
    accentSoft: "rgba(239,68,68,0.16)",
    chatTitle: "Desi Adda",
    atmosphere: "lights",
    playerStyle: "neon",
  },
  {
    name: "Chai Break",
    emoji: "☕",
    title: "चाय Break",
    subtitle: "Chai • Gupshup • Gaane",
    background: "/themes/chai-break.jpg",
    accent: "#D97706",
    accentSoft: "rgba(217,119,6,0.16)",
    chatTitle: "Chai Pe Charcha",
    atmosphere: "steam",
    playerStyle: "vintage",
  },
  {
    name: "Kaam Ka Radio",
    emoji: "🔧",
    title: "काम का Radio",
    subtitle: "Kaam Chale • Gaana Baje",
    background: "/themes/kaam-ka-radio.jpg",
    accent: "#EAB308",
    accentSoft: "rgba(234,179,8,0.16)",
    chatTitle: "Kaam Ka Adda",
    atmosphere: "dust",
    playerStyle: "glass",
  },
  {
    name: "Purani Yaadein",
    emoji: "📻",
    title: "पुरानी Yaadein",
    subtitle: "Old Songs • Golden Memories",
    background: "/themes/purani-yaadein.jpg",
    accent: "#C08457",
    accentSoft: "rgba(192,132,87,0.16)",
    chatTitle: "Yaadon Ka Adda",
    atmosphere: "film",
    playerStyle: "vintage",
  },
  {
    name: "Office Escape",
    emoji: "💼",
    title: "Office Escape",
    subtitle: "Deadlines • Chai • Music",
    background: "/themes/office-escape.jpg",
    accent: "#8B5CF6",
    accentSoft: "rgba(139,92,246,0.16)",
    chatTitle: "After Hours",
    atmosphere: "lights",
    playerStyle: "glass",
  },
];

const CHAT_COLORS = [
  "text-lime-400",
  "text-orange-300",
  "text-violet-400",
  "text-cyan-400",
  "text-red-400",
  "text-pink-400",
];

const INITIAL_MESSAGES = [
  {
    name: "RetroRoom",
    message: "Welcome to RetroRoom FM ✨",
    time: "now",
    bot: true,
  },
  {
    name: "RetroRoom",
    message: "Gaana pasand aaye toh ❤️ bhejna!",
    time: "now",
    bot: true,
  },
  {
    name: "Mohit",
    message: "Bhai kya mast song chal raha hai 🔥",
    time: "1:10 pm",
    bot: false,
  },
  {
    name: "Jockey",
    message: "Aaj purane gaane sunne ka mood hai 😌",
    time: "1:17 pm",
    bot: false,
  },
  {
    name: "Shreya",
    message: "Anyone listening from Delhi? 👀",
    time: "1:21 pm",
    bot: false,
  },
];

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const rainCleanupRef =
    useRef<(() => void) | null>(null);

  const strongLightningTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const shakeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const [themeIndex, setThemeIndex] =
    useState(0);

  const [themeOpen, setThemeOpen] =
    useState(false);

  const [language, setLanguage] =
    useState("Hindi");

  const [currentSong, setCurrentSong] =
    useState<Song>(songs[0]);

  const [search, setSearch] =
    useState("");

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  const [listeners, setListeners] =
    useState(1179);

  const [rain, setRain] =
    useState(false);

  /*
   * Automatic rain intensity.
   *
   * 10 = very light
   * 40 = normal
   * 70 = heavy
   * 100 = storm
   */
  const [rainIntensity, setRainIntensity] =
    useState(10);

  const [lightning, setLightning] =
    useState(true);

  const [isLightning, setIsLightning] =
    useState(false);

  const [screenShake, setScreenShake] =
    useState(false);

  const [sirfGaane, setSirfGaane] =
    useState(false);

  const [chatOpen, setChatOpen] =
    useState(false);

  const [chatInput, setChatInput] =
    useState("");

  const [messages, setMessages] =
    useState(INITIAL_MESSAGES);

  const theme =
    THEMES[themeIndex];

  const languageSongs =
    songs.filter(
      (song) =>
        song.language === language
    );

  /* =====================================================
     THUNDER
     ===================================================== */

  const playThunder = useCallback(
    (initial = false) => {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        /*
         * IMPORTANT:
         *
         * Thunder has its OWN AudioContext.
         *
         * Music <audio> is completely separate.
         * So thunder cannot change music volume.
         */

        const ctx =
          new AudioContextClass();

        const now =
          ctx.currentTime;

        const master =
          ctx.createGain();

        /*
         * Strong but controlled thunder.
         */

        master.gain.setValueAtTime(
          0.0001,
          now
        );

        master.gain.exponentialRampToValueAtTime(
          initial ? 0.95 : 0.75,
          now + 0.025
        );

        master.gain.exponentialRampToValueAtTime(
          0.0001,
          now + 3.8
        );

        master.connect(
          ctx.destination
        );

        /* ELECTRIC CRACK */

        const crack =
          ctx.createOscillator();

        const crackGain =
          ctx.createGain();

        crack.type =
          "sawtooth";

        crack.frequency.setValueAtTime(
          300,
          now
        );

        crack.frequency.exponentialRampToValueAtTime(
          45,
          now + 0.32
        );

        crackGain.gain.setValueAtTime(
          initial ? 1.15 : 0.95,
          now
        );

        crackGain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + 0.36
        );

        crack.connect(
          crackGain
        );

        crackGain.connect(
          master
        );

        /* DEEP THUNDER */

        const low =
          ctx.createOscillator();

        const lowGain =
          ctx.createGain();

        low.type =
          "sine";

        low.frequency.setValueAtTime(
          88,
          now
        );

        low.frequency.exponentialRampToValueAtTime(
          22,
          now + 3.2
        );

        lowGain.gain.value =
          1.45;

        low.connect(
          lowGain
        );

        lowGain.connect(
          master
        );

        /* RUMBLE */

        const rumble =
          ctx.createOscillator();

        const rumbleGain =
          ctx.createGain();

        rumble.type =
          "triangle";

        rumble.frequency.setValueAtTime(
          52,
          now + 0.02
        );

        rumble.frequency.exponentialRampToValueAtTime(
          14,
          now + 3.4
        );

        rumbleGain.gain.value =
          0.82;

        rumble.connect(
          rumbleGain
        );

        rumbleGain.connect(
          master
        );

        /* TEXTURE */

        const buffer =
          ctx.createBuffer(
            1,
            ctx.sampleRate * 3.6,
            ctx.sampleRate
          );

        const data =
          buffer.getChannelData(0);

        for (
          let i = 0;
          i < data.length;
          i++
        ) {
          const t =
            i / data.length;

          data[i] =
            (Math.random() * 2 - 1) *
            Math.pow(
              1 - t,
              1.55
            );
        }

        const noise =
          ctx.createBufferSource();

        const filter =
          ctx.createBiquadFilter();

        const noiseGain =
          ctx.createGain();

        filter.type =
          "lowpass";

        filter.frequency.setValueAtTime(
          1500,
          now
        );

        filter.frequency.exponentialRampToValueAtTime(
          75,
          now + 3.3
        );

        noiseGain.gain.setValueAtTime(
          0.0001,
          now
        );

        noiseGain.gain.exponentialRampToValueAtTime(
          initial
            ? 0.65
            : 0.48,
          now + 0.02
        );

        noiseGain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + 3.5
        );

        noise.buffer =
          buffer;

        noise.connect(
          filter
        );

        filter.connect(
          noiseGain
        );

        noiseGain.connect(
          master
        );

        /*
         * Browser may start context suspended.
         */

        if (
          ctx.state ===
          "suspended"
        ) {
          ctx.resume().catch(
            () => {}
          );
        }

        crack.start(now);
        low.start(now);
        rumble.start(
          now + 0.01
        );
        noise.start(now);

        /*
         * SAFE CLEANUP
         *
         * Never close an already closed
         * AudioContext.
         */

        window.setTimeout(
          () => {
            try {
              if (
                ctx.state !==
                "closed"
              ) {
                crack.stop();
              }
            } catch {}

            try {
              if (
                ctx.state !==
                "closed"
              ) {
                low.stop();
              }
            } catch {}

            try {
              if (
                ctx.state !==
                "closed"
              ) {
                rumble.stop();
              }
            } catch {}

            try {
              if (
                ctx.state !==
                "closed"
              ) {
                noise.stop();
              }
            } catch {}

            try {
              if (
                ctx.state !==
                "closed"
              ) {
                ctx.close().catch(
                  () => {}
                );
              }
            } catch {}
          },
          4000
        );
      } catch {}
    },
    []
  );

  /* =====================================================
     REALISTIC RAIN SOUND
     ===================================================== */

  const startRainSound =
    useCallback(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return () => {};
      }

      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContextClass) {
          return () => {};
        }

        const ctx =
          new AudioContextClass();

        const master =
          ctx.createGain();

        /*
         * Rain sound is intentionally
         * limited.
         *
         * 100% rain intensity DOES NOT
         * mean 100% audio volume.
         *
         * Maximum is around 50%.
         */

        const normalized =
          Math.max(
            10,
            Math.min(
              100,
              rainIntensity
            )
          ) / 100;

        const targetVolume =
          0.015 +
          normalized * 0.18;

        master.gain.value =
          targetVolume;

        master.connect(
          ctx.destination
        );

        /* CONTINUOUS RAIN */

        const bufferLength =
          ctx.sampleRate * 4;

        const buffer =
          ctx.createBuffer(
            2,
            bufferLength,
            ctx.sampleRate
          );

        for (
          let channel = 0;
          channel < 2;
          channel++
        ) {
          const channelData =
            buffer.getChannelData(
              channel
            );

          for (
            let i = 0;
            i < bufferLength;
            i++
          ) {
            channelData[i] =
              Math.random() *
                2 -
              1;
          }
        }

        const source =
          ctx.createBufferSource();

        source.buffer =
          buffer;

        source.loop =
          true;

        /* MAIN RAIN */

        const rainFilter =
          ctx.createBiquadFilter();

        rainFilter.type =
          "bandpass";

        rainFilter.frequency.value =
          1800 +
          normalized * 3000;

        rainFilter.Q.value =
          0.55;

        const rainGain =
          ctx.createGain();

        rainGain.gain.value =
          0.12 +
          normalized * 0.28;

        source.connect(
          rainFilter
        );

        rainFilter.connect(
          rainGain
        );

        rainGain.connect(
          master
        );

        /* LOW RUMBLE */

        const lowFilter =
          ctx.createBiquadFilter();

        lowFilter.type =
          "lowpass";

        lowFilter.frequency.value =
          650 +
          normalized * 500;

        const lowGain =
          ctx.createGain();

        lowGain.gain.value =
          0.03 +
          normalized * 0.10;

        source.connect(
          lowFilter
        );

        lowFilter.connect(
          lowGain
        );

        lowGain.connect(
          master
        );

        source.start();

        /* DROPLETS */

        const dropletTimer =
          window.setInterval(
            () => {
              if (
                ctx.state ===
                "closed"
              ) {
                return;
              }

              const droplets =
                Math.floor(
                  1 +
                    normalized *
                      6
                );

              for (
                let i = 0;
                i < droplets;
                i++
              ) {
                try {
                  const osc =
                    ctx.createOscillator();

                  const gain =
                    ctx.createGain();

                  const dropletFilter =
                    ctx.createBiquadFilter();

                  const now =
                    ctx.currentTime;

                  osc.type =
                    "triangle";

                  osc.frequency.setValueAtTime(
                    1800 +
                      Math.random() *
                        3200,
                    now
                  );

                  dropletFilter.type =
                    "highpass";

                  dropletFilter.frequency.value =
                    1300;

                  const dropletVolume =
                    0.0015 +
                    normalized *
                      0.012;

                  gain.gain.setValueAtTime(
                    0.0001,
                    now
                  );

                  gain.gain.exponentialRampToValueAtTime(
                    dropletVolume,
                    now + 0.006
                  );

                  gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    now +
                      0.035 +
                      Math.random() *
                        0.09
                  );

                  osc.connect(
                    dropletFilter
                  );

                  dropletFilter.connect(
                    gain
                  );

                  gain.connect(
                    master
                  );

                  osc.start(now);

                  osc.stop(
                    now +
                      0.14
                  );
                } catch {}
              }
            },
            130
          );

        if (
          ctx.state ===
          "suspended"
        ) {
          ctx.resume().catch(
            () => {}
          );
        }

        /*
         * SAFE CLEANUP
         */

        return () => {
          try {
            window.clearInterval(
              dropletTimer
            );
          } catch {}

          try {
            if (
              ctx.state !==
              "closed"
            ) {
              source.stop();
            }
          } catch {}

          try {
            if (
              ctx.state !==
              "closed"
            ) {
              ctx.close().catch(
                () => {}
              );
            }
          } catch {}
        };
      } catch {
        return () => {};
      }
    }, [rainIntensity]);

  /* =====================================================
     ONLINE COUNT
     ===================================================== */

  useEffect(() => {
    const timer =
      setInterval(() => {
        setListeners(
          (value) => {
            const change =
              Math.floor(
                Math.random() * 9
              ) - 4;

            return Math.max(
              100,
              Math.min(
                2500,
                value + change
              )
            );
          }
        );
      }, 5000);

    return () =>
      clearInterval(timer);
  }, []);

  /* =====================================================
     VOLUME
     ===================================================== */

  useEffect(() => {
    if (
      !audioRef.current
    ) {
      return;
    }

    /*
     * Only MUSIC audio volume.
     *
     * Rain / thunder have separate
     * AudioContexts.
     */

    audioRef.current.volume =
      volume;
  }, [volume]);

  /* =====================================================
     SONG CHANGE
     ===================================================== */

  useEffect(() => {
    if (
      !audioRef.current
    ) {
      return;
    }

    audioRef.current.pause();

    audioRef.current.currentTime =
      0;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    audioRef.current.load();
  }, [currentSong]);

  /* =====================================================
     PLAY
     ===================================================== */

  const playAudio =
    async () => {
      if (
        !audioRef.current
      ) {
        return;
      }

      try {
        await audioRef.current.play();

        setIsPlaying(true);
      } catch (error) {
        console.log(
          "Audio error:",
          error
        );
      }
    };

  /* =====================================================
     PAUSE
     ===================================================== */

  const pauseAudio =
    () => {
      if (
        !audioRef.current
      ) {
        return;
      }

      audioRef.current.pause();

      setIsPlaying(false);
    };

  /* =====================================================
     TOGGLE AUDIO
     ===================================================== */

  const toggleAudio =
    () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    };

  /* =====================================================
     NEXT SONG
     ===================================================== */

  const nextSong =
    () => {
      if (
        !languageSongs.length
      ) {
        return;
      }

      const currentIndex =
        languageSongs.findIndex(
          (song) =>
            song.id ===
            currentSong.id
        );

      const nextIndex =
        currentIndex ===
          -1 ||
        currentIndex ===
          languageSongs.length -
            1
          ? 0
          : currentIndex + 1;

      setCurrentSong(
        languageSongs[
          nextIndex
        ]
      );

      window.setTimeout(
        () => {
          audioRef.current
            ?.play()
            .catch(
              () => {}
            );
        },
        250
      );
    };

  /* =====================================================
     PREVIOUS SONG
     ===================================================== */

  const previousSong =
    () => {
      if (
        !languageSongs.length
      ) {
        return;
      }

      const currentIndex =
        languageSongs.findIndex(
          (song) =>
            song.id ===
            currentSong.id
        );

      const previousIndex =
        currentIndex <= 0
          ? languageSongs.length -
            1
          : currentIndex - 1;

      setCurrentSong(
        languageSongs[
          previousIndex
        ]
      );

      window.setTimeout(
        () => {
          audioRef.current
            ?.play()
            .catch(
              () => {}
            );
        },
        250
      );
    };

  /* =====================================================
     SELECT SONG
     ===================================================== */

  const selectSong =
    (song: Song) => {
      setCurrentSong(song);
      setCurrentTime(0);

      window.setTimeout(
        () => {
          audioRef.current
            ?.play()
            .then(() =>
              setIsPlaying(
                true
              )
            )
            .catch(
              () => {}
            );
        },
        250
      );
    };

  /* =====================================================
     LANGUAGE
     ===================================================== */

  const changeLanguage =
    (
      newLanguage: string
    ) => {
      setLanguage(
        newLanguage
      );

      setSearch("");

      const firstSong =
        songs.find(
          (song) =>
            song.language ===
            newLanguage
        );

      if (firstSong) {
        setCurrentSong(
          firstSong
        );
      }

      pauseAudio();
    };

  /* =====================================================
     AUDIO TIME
     ===================================================== */

  const handleTimeUpdate =
    () => {
      if (
        !audioRef.current
      ) {
        return;
      }

      setCurrentTime(
        audioRef.current
          .currentTime
      );
    };

  const handleLoadedMetadata =
    () => {
      if (
        !audioRef.current
      ) {
        return;
      }

      setDuration(
        audioRef.current
          .duration || 0
      );
    };

  /* =====================================================
     SEEK
     ===================================================== */

  const handleSeek =
    (
      value: number
    ) => {
      if (
        !audioRef.current
      ) {
        return;
      }

      audioRef.current.currentTime =
        value;

      setCurrentTime(value);
    };

  /* =====================================================
     END
     ===================================================== */

  const handleEnded =
    () => {
      nextSong();
    };

  /* =====================================================
     THEME
     ===================================================== */

  const changeTheme =
    (
      index: number
    ) => {
      setThemeIndex(index);
      setThemeOpen(false);
    };

  /* =====================================================
     LIGHTNING SCREEN SHAKE
     ===================================================== */

  const triggerLightning =
    useCallback(
      (
        strong = false
      ) => {
        setIsLightning(true);

        /*
         * Minimal shake only.
         *
         * It is CSS only.
         * Music audio remains untouched.
         */

        if (strong) {
          setScreenShake(true);

          if (
            shakeTimerRef.current
          ) {
            clearTimeout(
              shakeTimerRef.current
            );
          }

          shakeTimerRef.current =
            setTimeout(() => {
              setScreenShake(
                false
              );
            }, 360);
        }

        window.setTimeout(
          () => {
            setIsLightning(
              false
            );
          },
          strong ? 520 : 430
        );
      },
      []
    );

  /* =====================================================
     RAIN TOGGLE
     ===================================================== */

  const toggleRain =
    () => {
      const nextValue =
        !rain;

      /*
       * Clear pending strong lightning.
       */

      if (
        strongLightningTimerRef.current
      ) {
        clearTimeout(
          strongLightningTimerRef.current
        );

        strongLightningTimerRef.current =
          null;
      }

      if (!nextValue) {
        setRain(false);
        setRainIntensity(10);
        setIsLightning(false);
        setScreenShake(false);

        return;
      }

      /*
       * Rain ON.
       *
       * Start from very light rain.
       */

      setRain(true);
      setRainIntensity(10);

      /*
       * First dramatic lightning
       * exactly around 2 seconds later.
       */

      if (
        lightning &&
        !sirfGaane
      ) {
        strongLightningTimerRef.current =
          setTimeout(() => {
            /*
             * Re-check current state.
             */

            if (
              !rain &&
              !sirfGaane
            ) {
              triggerLightning(
                true
              );

              playThunder(true);
            }
          }, 2000);
      }
    };

  /* =====================================================
     AUTOMATIC RAIN INTENSITY
     ===================================================== */

  useEffect(() => {
    if (
      !rain ||
      sirfGaane
    ) {
      return;
    }

    /*
     * Slowly increase rain.
     *
     * Every 5 seconds:
     * +2 intensity
     */

    const timer =
      window.setInterval(() => {
        setRainIntensity(
          (current) =>
            Math.min(
              100,
              current + 2
            )
        );
      }, 5000);

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    rain,
    sirfGaane,
  ]);

  /* =====================================================
     RAIN AUDIO
     ===================================================== */

  useEffect(() => {
    /*
     * Always cleanup previous
     * rain audio first.
     */

    if (
      rainCleanupRef.current
    ) {
      try {
        rainCleanupRef.current();
      } catch {}

      rainCleanupRef.current =
        null;
    }

    if (
      !rain ||
      sirfGaane
    ) {
      return;
    }

    const cleanup =
      startRainSound();

    rainCleanupRef.current =
      cleanup;

    return () => {
      if (
        rainCleanupRef.current ===
        cleanup
      ) {
        try {
          cleanup();
        } catch {}

        rainCleanupRef.current =
          null;
      }
    };
  }, [
    rain,
    sirfGaane,
    rainIntensity,
    startRainSound,
  ]);

  /* =====================================================
     LIGHTNING SYSTEM
     ===================================================== */

  useEffect(() => {
    if (
      !rain ||
      !lightning ||
      sirfGaane
    ) {
      setIsLightning(false);
      return;
    }

    let timer:
      ReturnType<
        typeof setTimeout
      >;

    /*
     * Strong lightning cooldown.
     *
     * At least 25–30 seconds.
     */

    const schedule =
      () => {
        const delay =
          25000 +
          Math.random() *
            5000;

        timer =
          setTimeout(() => {
            if (
              !rain ||
              !lightning ||
              sirfGaane
            ) {
              return;
            }

            /*
             * Strong lightning
             */

            triggerLightning(
              true
            );

            playThunder(false);

            schedule();
          }, delay);
      };

    /*
     * Don't immediately schedule
     * another lightning when the
     * initial 2 sec lightning is used.
     */

    timer =
      setTimeout(() => {
        schedule();
      }, 3000);

    return () => {
      clearTimeout(timer);
      setIsLightning(false);
      setScreenShake(false);
    };
  }, [
    rain,
    lightning,
    sirfGaane,
    triggerLightning,
    playThunder,
  ]);

  /* =====================================================
     SIRF GAANE
     ===================================================== */

  const toggleSirfGaane =
    () => {
      const nextValue =
        !sirfGaane;

      setSirfGaane(
        nextValue
      );

      if (nextValue) {
        setRain(false);
        setRainIntensity(10);
        setLightning(false);
        setIsLightning(false);
        setScreenShake(false);
        setChatOpen(false);

        if (
          rainCleanupRef.current
        ) {
          try {
            rainCleanupRef.current();
          } catch {}

          rainCleanupRef.current =
            null;
        }

        if (
          strongLightningTimerRef.current
        ) {
          clearTimeout(
            strongLightningTimerRef.current
          );

          strongLightningTimerRef.current =
            null;
        }
      }
    };

  /* =====================================================
     SHARE
     ===================================================== */

  const shareSite =
    async () => {
      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            {
              title:
                "RetroRoom FM",
              text:
                "Listen to RetroRoom FM",
              url:
                window.location
                  .href,
            }
          );
        } else {
          await navigator.clipboard.writeText(
            window.location
              .href
          );

          alert(
            "Link copied!"
          );
        }
      } catch {
        // User cancelled sharing.
      }
    };

  /* =====================================================
     CHAT
     ===================================================== */

  const sendMessage =
    () => {
      const text =
        chatInput.trim();

      if (!text) {
        return;
      }

      setMessages(
        (current) => [
          ...current,
          {
            name: "You",
            message: text,
            time:
              new Date().toLocaleTimeString(
                [],
                {
                  hour: "numeric",
                  minute:
                    "2-digit",
                }
              ),
            bot: false,
          },
        ]
      );

      setChatInput("");
    };

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-black text-white ${
        screenShake
          ? "lightning-shake"
          : ""
      }`}
      style={{
        ["--theme-accent" as string]:
          theme.accent,

        ["--theme-accent-soft" as string]:
          theme.accentSoft,
      }}
    >
      {/* =================================================
          AUDIO
      ================================================= */}

      <audio
        ref={audioRef}
        src={currentSong?.url}
        preload="metadata"
        onTimeUpdate={
          handleTimeUpdate
        }
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onEnded={handleEnded}
        onPlay={() =>
          setIsPlaying(true)
        }
        onPause={() =>
          setIsPlaying(false)
        }
      />

      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] ease-out"
          style={{
            backgroundImage:
              `url("${theme.background}")`,
          }}
        />

        {/* Rain darkness automatically grows */}

        {rain && (
          <div
            className="absolute inset-0 transition-all duration-[3000ms]"
            style={{
              background:
                `linear-gradient(
                  to bottom,
                  rgba(5,10,18,${
                    0.10 +
                    rainIntensity /
                      180
                  }),
                  rgba(0,0,0,${
                    0.15 +
                    rainIntensity /
                      330
                  })
                )`,
            }}
          />
        )}

        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background:
              `radial-gradient(
                circle at 50% 35%,
                ${theme.accentSoft},
                transparent 48%
              )`,
          }}
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/90" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.7)_100%)]" />

        {/* =================================================
            AUTOMATIC CLOUD COVER
        ================================================= */}

        {rain &&
          !sirfGaane && (
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[3000ms]"
              style={{
                opacity:
                  0.25 +
                  rainIntensity /
                    125,
              }}
            >
              {/* SMALL CLOUD 1 */}

              <div
                className="absolute left-[8%] top-[10%] h-16 w-36 rounded-full bg-slate-900/50 blur-xl"
                style={{
                  animation:
                    "cloudFloat 18s ease-in-out infinite",
                }}
              />

              <div
                className="absolute left-[14%] top-[7%] h-20 w-24 rounded-full bg-slate-800/45 blur-2xl"
                style={{
                  animation:
                    "cloudFloat 21s ease-in-out infinite reverse",
                }}
              />

              {/* SMALL CLOUD 2 */}

              <div
                className="absolute left-[42%] top-[8%] h-20 w-44 rounded-full bg-black/55 blur-xl"
                style={{
                  animation:
                    "cloudFloat 24s ease-in-out infinite",
                  animationDelay:
                    "-7s",
                }}
              />

              <div
                className="absolute left-[49%] top-[4%] h-24 w-28 rounded-full bg-slate-900/50 blur-2xl"
                style={{
                  animation:
                    "cloudFloat 20s ease-in-out infinite reverse",
                  animationDelay:
                    "-4s",
                }}
              />

              {/* SMALL CLOUD 3 */}

              <div
                className="absolute right-[8%] top-[13%] h-20 w-40 rounded-full bg-slate-950/60 blur-xl"
                style={{
                  animation:
                    "cloudFloat 22s ease-in-out infinite",
                }}
              />

              <div
                className="absolute right-[15%] top-[8%] h-16 w-24 rounded-full bg-slate-900/50 blur-2xl"
                style={{
                  animation:
                    "cloudFloat 19s ease-in-out infinite reverse",
                }}
              />

              {/* LARGE CLOUD COVER */}

              <div
                className="absolute -left-[10%] -top-[8%] h-56 w-[120%] rounded-[50%] bg-black/25 blur-3xl transition-opacity duration-[4000ms]"
                style={{
                  opacity:
                    Math.max(
                      0,
                      rainIntensity -
                        45
                    ) / 70,
                }}
              />

              <div
                className="absolute left-[20%] top-[18%] h-32 w-[60%] rounded-full bg-slate-950/30 blur-3xl transition-opacity duration-[4000ms]"
                style={{
                  opacity:
                    Math.max(
                      0,
                      rainIntensity -
                        55
                    ) / 60,
                }}
              />
            </div>
          )}

        {theme.atmosphere ===
          "film" && (
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-screen"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")",
            }}
          />
        )}
      </div>

      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      {theme.atmosphere ===
        "dust" && (
        <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
          {Array.from({
            length: 22,
          }).map(
            (_, index) => (
              <span
                key={index}
                className="absolute h-1 w-1 rounded-full bg-amber-200/20"
                style={{
                  left: `${
                    (index * 43) %
                    100
                  }%`,
                  top: `${
                    (index * 29) %
                    100
                  }%`,
                  animation:
                    `floatDust ${
                      5 +
                      (index % 5)
                    }s ease-in-out infinite`,
                  animationDelay:
                    `${index * 0.3}s`,
                }}
              />
            )
          )}
        </div>
      )}

      {theme.atmosphere ===
        "lights" && (
        <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
          <div className="absolute -left-20 top-1/3 h-40 w-[500px] rotate-[-18deg] bg-orange-400/10 blur-3xl" />

          <div className="absolute -right-20 top-1/2 h-40 w-[500px] rotate-[18deg] bg-purple-400/10 blur-3xl" />
        </div>
      )}

      {theme.atmosphere ===
        "steam" && (
        <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
          {Array.from({
            length: 8,
          }).map(
            (_, index) => (
              <span
                key={index}
                className="absolute bottom-[-20px] h-32 w-16 rounded-full bg-white/[0.025] blur-2xl"
                style={{
                  left: `${
                    15 +
                    index * 11
                  }%`,
                  animation:
                    `steam ${
                      4 +
                      (index % 3)
                    }s ease-in-out infinite`,
                  animationDelay:
                    `${index * 0.4}s`,
                }}
              />
            )
          )}
        </div>
      )}

      {/* =================================================
          RAIN
      ================================================= */}

      {rain &&
        !sirfGaane && (
          <div
            className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
            aria-hidden="true"
          >
            {/* DARK CLOUD / MIST */}

            <div
              className="absolute inset-0 transition-all duration-[4000ms]"
              style={{
                background:
                  `radial-gradient(
                    circle at 50% 0%,
                    rgba(255,255,255,${
                      0.025 +
                      rainIntensity /
                        4000
                    }),
                    transparent 45%
                  ),
                  linear-gradient(
                    to bottom,
                    rgba(8,16,25,${
                      rainIntensity /
                      300
                    }),
                    rgba(0,0,0,${
                      rainIntensity /
                      700
                    })
                  )`,
              }}
            />

            {/* RAIN MIST */}

            <div
              className="absolute inset-0"
              style={{
                animation:
                  "rainMist 7s ease-in-out infinite",

                opacity:
                  0.12 +
                  rainIntensity /
                    250,
              }}
            />

            {/* MAIN RAIN */}

            <div
              className="absolute -inset-x-[10%] -top-[12%] h-[125%]"
              style={{
                opacity:
                  0.08 +
                  rainIntensity /
                    180,
              }}
            >
              {Array.from({
                length:
                  Math.round(
                    5 +
                      Math.pow(
                        rainIntensity /
                          100,
                        1.35
                      ) *
                        215
                  ),
              }).map(
                (_, index) => (
                  <span
                    key={`fine-${index}`}
                    className="absolute top-0 rounded-full bg-white/35"
                    style={{
                      left: `${
                        (index * 37) %
                        100
                      }%`,

                      height: `${
                        16 +
                        (index % 6) *
                          4
                      }px`,

                      width:
                        rainIntensity >
                        75
                          ? "1.25px"
                          : "1px",

                      animation:
                        `premiumRainFall ${
                          0.55 +
                          ((index *
                            17) %
                            75) /
                            100
                        }s linear infinite`,

                      animationDelay:
                        `-${((index * 23) % 180) / 100}s`,

                      transform:
                        `rotate(${
                          8 +
                          (index % 5)
                        }deg)`,
                    }}
                  />
                )
              )}
            </div>

            {/* FOREGROUND RAIN */}

            <div
              className="absolute -inset-x-[12%] -top-[12%] h-[125%]"
              style={{
                animation:
                  "rainDrift 5s linear infinite alternate",

                opacity:
                  0.10 +
                  rainIntensity /
                    180,
              }}
            >
              {Array.from({
                length:
                  Math.round(
                    3 +
                      Math.pow(
                        rainIntensity /
                          100,
                        1.4
                      ) *
                        105
                  ),
              }).map(
                (_, index) => (
                  <span
                    key={`heavy-${index}`}
                    className="absolute top-0 rounded-full bg-white/55 shadow-[0_0_4px_rgba(255,255,255,0.22)]"
                    style={{
                      left: `${
                        (index * 61) %
                        100
                      }%`,

                      opacity:
                        0.18 +
                        rainIntensity /
                          160,

                      height: `${
                        20 +
                        (index % 5) *
                          5
                      }px`,

                      width:
                        `${1 +
                          (index % 3) *
                            0.35}px`,

                      animation:
                        `premiumRainFall ${
                          0.42 +
                          ((index *
                            11) %
                            50) /
                            100
                        }s linear infinite`,

                      animationDelay:
                        `-${((index * 19) % 130) / 100}s`,

                      transform:
                        `rotate(${
                          10 +
                          (index % 4)
                        }deg)`,
                    }}
                  />
                )
              )}
            </div>

            {/* HEAVY MIST */}

            {rainIntensity >=
              70 && (
              <div
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/[0.045] via-white/[0.015] to-transparent"
                style={{
                  opacity:
                    (rainIntensity -
                      65) /
                    45,
                }}
              />
            )}

            {/* GROUND SPLASH */}

            {rainIntensity >=
              80 && (
              <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_65%)] blur-xl" />
            )}
          </div>
        )}

      {/* =================================================
          LIGHTNING
      ================================================= */}

      {isLightning &&
        rain &&
        lightning &&
        !sirfGaane && (
          <>
            <div
              className="pointer-events-none fixed inset-0 z-[40] bg-white/[0.46] mix-blend-screen"
              style={{
                animation:
                  "lightningGlow 520ms ease-out forwards",
              }}
            />

            <div
              className="pointer-events-none fixed inset-0 z-[40] bg-[radial-gradient(circle_at_52%_18%,rgba(255,255,255,0.34),transparent_42%)] mix-blend-screen"
              style={{
                animation:
                  "lightningGlow 520ms ease-out forwards",
              }}
            />
          </>
        )}

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style jsx global>{`
        @keyframes premiumRainFall {
          0% {
            transform: translate3d(0, -12vh, 0) rotate(10deg);
            opacity: 0;
          }

          8% {
            opacity: 0.72;
          }

          92% {
            opacity: 0.52;
          }

          100% {
            transform: translate3d(-8vw, 112vh, 0) rotate(10deg);
            opacity: 0;
          }
        }

        @keyframes rainDrift {
          0% {
            transform: translateX(8vw);
          }

          100% {
            transform: translateX(-8vw);
          }
        }

        @keyframes rainMist {
          0%,
          100% {
            opacity: 0.04;
            transform: scale(1);
          }

          50% {
            opacity: 0.12;
            transform: scale(1.04);
          }
        }

        @keyframes lightningGlow {
          0% {
            opacity: 0;
          }

          10% {
            opacity: 0.95;
          }

          24% {
            opacity: 0.10;
          }

          44% {
            opacity: 0.75;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes lightningShake {
          0% {
            transform: translate3d(0, 0, 0);
          }

          20% {
            transform: translate3d(-1px, 1px, 0);
          }

          40% {
            transform: translate3d(1px, -1px, 0);
          }

          60% {
            transform: translate3d(-1px, 0, 0);
          }

          80% {
            transform: translate3d(1px, 1px, 0);
          }

          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .lightning-shake {
          animation: lightningShake 360ms ease-out;
        }

        @keyframes cloudFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(35px, 8px, 0) scale(1.06);
          }
        }

        @keyframes floatDust {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.15;
          }

          50% {
            transform: translate3d(25px, -40px, 0);
            opacity: 0.55;
          }
        }

        @keyframes steam {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }

          40% {
            opacity: 0.4;
          }

          100% {
            transform: translateY(-300px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 min-h-screen">

        {/* =================================================
            NAV
        ================================================= */}

        <header className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-4 md:px-8">

          {/* ONLINE */}

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2.5 shadow-xl backdrop-blur-xl">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            <span className="text-xs font-semibold">
              {listeners}
            </span>

            <span className="hidden text-xs text-white/50 sm:block">
              online
            </span>

          </div>

          {/* THEME */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setThemeOpen(
                  (value) =>
                    !value
                )
              }
              className="rounded-full border border-white/20 bg-black/55 px-5 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-xl transition hover:bg-black/75 sm:min-w-[220px] sm:px-8 sm:text-sm"
            >
              {theme.emoji}{" "}
              {theme.name}

              <span className="ml-2 text-white/40">
                ▾
              </span>
            </button>

            {themeOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-[245px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#0b0807]/95 p-1 shadow-2xl backdrop-blur-2xl">

                {THEMES.map(
                  (
                    item,
                    index
                  ) => (
                    <button
                      key={
                        item.name
                      }
                      type="button"
                      onClick={() =>
                        changeTheme(
                          index
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                        index ===
                        themeIndex
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="text-lg">
                        {
                          item.emoji
                        }
                      </span>

                      <span className="flex-1">
                        {
                          item.name
                        }
                      </span>

                      {index ===
                        themeIndex && (
                        <span
                          style={{
                            color:
                              theme.accent,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* DESKTOP LINKS */}

          <div className="hidden items-center gap-2 lg:flex">

            <button className="rounded-full border border-white/15 bg-black/40 px-5 py-2.5 text-xs font-semibold backdrop-blur-xl transition hover:bg-white/10">
              About
            </button>

            <button className="rounded-full border border-white/15 bg-black/40 px-5 py-2.5 text-xs font-semibold backdrop-blur-xl transition hover:bg-white/10">
              FAQ
            </button>

            <button
              className="rounded-full border px-5 py-2.5 text-xs font-semibold backdrop-blur-xl transition hover:bg-white/10"
              style={{
                borderColor:
                  theme.accentSoft,
              }}
            >
              💗 Support us
            </button>

          </div>

        </header>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 pb-48 pt-12 text-center">

          <p
            className="text-[10px] uppercase tracking-[0.45em] transition-all sm:text-xs"
            style={{
              color:
                theme.accent,
            }}
          >
            {
              theme.subtitle
            }
          </p>

          <h1 className="mt-5 max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.06em] drop-shadow-2xl sm:text-7xl md:text-9xl">
            {theme.title}
          </h1>

          {/* LIVE CHAT */}

          <button
            type="button"
            onClick={() =>
              setChatOpen(
                true
              )
            }
            className="mt-8 rounded-full border bg-black/45 px-5 py-2.5 text-sm font-semibold shadow-xl backdrop-blur-xl transition hover:scale-[1.03]"
            style={{
              borderColor:
                theme.accentSoft,
              color:
                theme.accent,
            }}
          >
            💬{" "}
            {
              theme.chatTitle
            }
          </button>

          {/* ACTIONS */}

          <div className="mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">

            {/* WEATHER */}

            <div className="flex flex-wrap items-center gap-2">

              <button
                type="button"
                onClick={
                  toggleRain
                }
                className="rounded-full border bg-black/45 px-5 py-2.5 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/10"
                style={{
                  borderColor:
                    rain
                      ? theme.accent
                      : "rgba(255,255,255,0.15)",

                  color:
                    rain
                      ? theme.accent
                      : "rgba(255,255,255,0.65)",
                }}
              >
                🌧️ Baarish{" "}
                <span className="text-[10px]">
                  {rain
                    ? "ON"
                    : "OFF"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextValue =
                    !lightning;

                  setLightning(
                    nextValue
                  );

                  if (
                    !nextValue
                  ) {
                    setIsLightning(
                      false
                    );
                    setScreenShake(
                      false
                    );

                    if (
                      strongLightningTimerRef.current
                    ) {
                      clearTimeout(
                        strongLightningTimerRef.current
                      );

                      strongLightningTimerRef.current =
                        null;
                    }
                  }

                  if (
                    nextValue &&
                    rain &&
                    !sirfGaane
                  ) {
                    triggerLightning(
                      true
                    );

                    playThunder(
                      true
                    );
                  }
                }}
                disabled={!rain}
                className="rounded-full border bg-black/45 px-5 py-2.5 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                style={{
                  borderColor:
                    lightning &&
                    rain
                      ? theme.accent
                      : "rgba(255,255,255,0.15)",

                  color:
                    lightning &&
                    rain
                      ? theme.accent
                      : "rgba(255,255,255,0.65)",
                }}
              >
                ⚡ Bijli{" "}
                <span className="text-[10px]">
                  {lightning &&
                  rain
                    ? "ON"
                    : "OFF"}
                </span>
              </button>

            </div>

            {/* AUTOMATIC RAIN STATUS */}

            {rain &&
              !sirfGaane && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/45 px-4 py-3 backdrop-blur-xl">

                  <span className="text-xs">
                    🌧️
                  </span>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                      Automatic Rain
                    </div>

                    <div
                      className="mt-0.5 text-[11px] font-semibold"
                      style={{
                        color:
                          theme.accent,
                      }}
                    >
                      Intensity{" "}
                      {
                        rainIntensity
                      }
                      %
                    </div>
                  </div>

                  <span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

                </div>
              )}

            {/* SIRF GAANE */}

            <button
              type="button"
              onClick={
                toggleSirfGaane
              }
              className="rounded-full border bg-black/45 px-5 py-2.5 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/10"
              style={{
                borderColor:
                  sirfGaane
                    ? theme.accent
                    : "rgba(255,255,255,0.15)",

                color:
                  sirfGaane
                    ? theme.accent
                    : "rgba(255,255,255,0.65)",
              }}
            >
              ⚡ Sirf Gaane{" "}
              <span className="text-[10px]">
                {sirfGaane
                  ? "ON"
                  : "OFF"}
              </span>
            </button>

            {/* FEEDBACK */}

            <button
              type="button"
              className="rounded-full border border-white/15 bg-black/45 px-5 py-2.5 text-sm font-semibold text-white/65 backdrop-blur-xl transition hover:bg-white/10"
            >
              📸 Feedback
            </button>

            {/* SHARE */}

            <button
              type="button"
              onClick={
                shareSite
              }
              className="rounded-full border border-white/15 bg-black/45 px-5 py-2.5 text-sm font-semibold text-white/65 backdrop-blur-xl transition hover:bg-white/10"
            >
              🔗 Share
            </button>

          </div>

          {/* PLAYER */}

          <div className="mt-6 w-full max-w-[900px]">

            <div
              className="rounded-[28px] transition-all duration-700"
              style={{
                boxShadow:
                  theme.playerStyle ===
                  "neon"
                    ? `0 0 70px ${theme.accentSoft}`
                    : "0 25px 80px rgba(0,0,0,0.45)",
              }}
            >
              <MusicPlayer
                song={
                  currentSong
                }
                isPlaying={
                  isPlaying
                }
                currentTime={
                  currentTime
                }
                duration={
                  duration
                }
                volume={
                  volume
                }
                onPlay={
                  playAudio
                }
                onPause={
                  pauseAudio
                }
                onToggle={
                  toggleAudio
                }
                onNext={
                  nextSong
                }
                onPrevious={
                  previousSong
                }
                onSeek={
                  handleSeek
                }
                onVolumeChange={
                  setVolume
                }
              />
            </div>

          </div>

          <div className="mt-7 font-mono text-[10px] tracking-[0.2em] text-white/30">
            RETROROOM FM • MUSIC • MEMORIES • MOMENTS
          </div>

          <div className="mt-7 text-[9px] uppercase tracking-[0.4em] text-white/30">
            Scroll

            <div className="mt-2 text-base">
              ↓
            </div>
          </div>

        </section>

        {/* =================================================
            LIBRARY
        ================================================= */}

        <section className="relative bg-black/75 px-4 py-20 backdrop-blur-sm md:px-10">

          <div className="mx-auto max-w-6xl">

            <div className="mb-8">

              <p
                className="text-xs uppercase tracking-[0.35em]"
                style={{
                  color:
                    theme.accent,
                }}
              >
                Music Library
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Explore Music
              </h2>

            </div>

            <SearchBar
              search={search}
              setSearch={setSearch}
            />

            <div className="my-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">

              <LanguageSelector
                setLanguage={
                  changeLanguage
                }
              />

            </div>

            <Playlist
              language={
                language
              }
              search={search}
              onSelectSong={
                selectSong
              }
              currentSongId={
                currentSong.id
              }
              isPlaying={
                isPlaying
              }
            />

          </div>

        </section>

      </div>

      {/* =================================================
          MINI PLAYER
      ================================================= */}

      <MiniPlayer
        song={currentSong}
        isPlaying={
          isPlaying
        }
        onPlay={
          playAudio
        }
        onPause={
          pauseAudio
        }
        onNext={
          nextSong
        }
      />

      {/* =================================================
          RETROROOM LIVE LOUNGE
      ================================================= */}

      {chatOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-xl"
          onClick={() =>
            setChatOpen(
              false
            )
          }
        >

          <div
            className="relative flex h-[650px] max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[30px] border border-white/[0.12] bg-[#100b09]/95 shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* CHAT HEADER */}

            <div className="border-b border-white/[0.08] px-5 pb-4 pt-5">

              <div className="flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span
                      className="h-2 w-2 animate-pulse rounded-full"
                      style={{
                        backgroundColor:
                          theme.accent,
                      }}
                    />

                    <h3 className="text-lg font-semibold">
                      {
                        theme.chatTitle
                      }
                    </h3>

                  </div>

                  <p className="mt-1 text-[11px] text-white/35">
                    Talk • Request • Vibe together
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setChatOpen(
                      false
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-white/40 transition hover:bg-white/[0.1] hover:text-white"
                >
                  ✕
                </button>

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-[10px] text-emerald-300">
                  ●{" "}
                  {
                    listeners
                  }{" "}
                  listening
                </div>

                <div className="max-w-[250px] truncate rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/35">
                  🎵{" "}
                  {
                    currentSong?.title ||
                    "Music"
                  }
                </div>

              </div>

            </div>

            {/* MESSAGES */}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">

              <div className="space-y-4">

                {messages.map(
                  (
                    message,
                    index
                  ) => (
                    <div
                      key={`${message.time}-${index}`}
                      className={`flex ${
                        message.name ===
                        "You"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div className="max-w-[82%]">

                        <div
                          className={`mb-1 px-2 text-[10px] font-semibold ${
                            message.bot
                              ? "text-amber-300"
                              : CHAT_COLORS[
                                  index %
                                    CHAT_COLORS.length
                                ]
                          }`}
                        >
                          {message.bot
                            ? "✨ RetroRoom"
                            : message.name}
                        </div>

                        <div
                          className={`rounded-2xl border px-4 py-3 ${
                            message.name ===
                            "You"
                              ? "rounded-br-md border-amber-400/20 bg-amber-400/[0.12]"
                              : message.bot
                              ? "rounded-tl-md border-amber-400/15 bg-amber-400/[0.06]"
                              : "rounded-tl-md border-white/[0.07] bg-white/[0.055]"
                          }`}
                        >

                          <p className="text-sm leading-relaxed text-white/85">
                            {
                              message.message
                            }
                          </p>

                          <div className="mt-2 text-right text-[9px] text-white/25">
                            {
                              message.time
                            }
                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* QUICK REACTIONS */}

            <div className="flex gap-2 overflow-x-auto border-t border-white/[0.06] px-4 py-3">

              {[
                "❤️",
                "🔥",
                "🎵",
                "😂",
                "🙌",
              ].map(
                (emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setMessages(
                        (
                          current
                        ) => [
                          ...current,
                          {
                            name: "You",
                            message:
                              emoji,
                            time: "now",
                            bot: false,
                          },
                        ]
                      );
                    }}
                    className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.035] text-sm transition hover:scale-110 hover:bg-white/[0.08]"
                  >
                    {emoji}
                  </button>
                )
              )}

            </div>

            {/* INPUT */}

            <div className="border-t border-white/[0.07] bg-black/20 p-4">

              <div className="flex items-center gap-2">

                <input
                  type="text"
                  value={
                    chatInput
                  }
                  onChange={(
                    event
                  ) =>
                    setChatInput(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      sendMessage();
                    }
                  }}
                  placeholder="Say something..."
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.055]"
                />

                <button
                  type="button"
                  onClick={
                    sendMessage
                  }
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg text-black shadow-lg transition hover:scale-105"
                  style={{
                    backgroundColor:
                      theme.accent,
                  }}
                >
                  ↑
                </button>

              </div>

              <p className="mt-2 px-1 text-[9px] text-white/20">
                Be nice. Share the vibe. 🎧
              </p>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}