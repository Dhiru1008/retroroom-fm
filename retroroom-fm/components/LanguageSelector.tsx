"use client";

interface Props {
  setLanguage: (language: string) => void;
}

const languages = [
  {
    name: "Hindi",
    flag: "🇮🇳",
    icon: "🎧",
  },
  {
    name: "Punjabi",
    flag: "🇮🇳",
    icon: "🎵",
  },
  {
    name: "Tamil",
    flag: "🇮🇳",
    icon: "🎶",
  },
  {
    name: "Telugu",
    flag: "🇮🇳",
    icon: "🎼",
  },
  {
    name: "Bengali",
    flag: "🇮🇳",
    icon: "🎤",
  },
  {
    name: "Marathi",
    flag: "🇮🇳",
    icon: "🎹",
  },
  {
    name: "English",
    flag: "🌎",
    icon: "🎸",
  },
];

export default function LanguageSelector({
  setLanguage,
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

      {languages.map((language) => (
        <button
          key={language.name}
          onClick={() => setLanguage(language.name)}
          className="
            group
            relative
            flex
            min-w-[120px]
            shrink-0
            items-center
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-white/[0.035]
            px-4
            py-3
            text-left
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-white/20
            hover:bg-white/[0.08]
            hover:shadow-xl
          "
        >

          {/* Icon */}

          <div className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white/[0.06]
            text-lg
            transition
            duration-300
            group-hover:scale-110
            group-hover:bg-white/10
          ">
            {language.icon}
          </div>

          {/* Text */}

          <div className="min-w-0">

            <div className="
              flex
              items-center
              gap-1.5
            ">

              <span className="text-sm font-medium text-white/80">
                {language.name}
              </span>

              <span className="text-xs">
                {language.flag}
              </span>

            </div>

            <p className="
              mt-0.5
              text-[9px]
              uppercase
              tracking-wider
              text-white/25
            ">
              Explore
            </p>

          </div>

          {/* Hover arrow */}

          <span className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-xs
            text-white/0
            transition
            group-hover:text-white/40
          ">
            →
          </span>

        </button>
      ))}

    </div>
  );
}