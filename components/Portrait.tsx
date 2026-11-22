// An original illustrated tribute portrait of Isaignani Ilaiyaraaja:
// flowing white hair & beard, white attire, vibhuti on the forehead,
// surrounded by orbiting notes and a harmonium keyboard.
export default function Portrait({ photo }: { photo: boolean }) {
  return (
    <div className="portrait">
      <div className="portrait-ring" />
      <div className="portrait-inner">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/ilaiyaraaja.jpg" alt="Isaignani Ilaiyaraaja" />
        ) : (
          <svg viewBox="0 0 400 400" role="img" aria-label="Illustrated portrait of Ilaiyaraaja">
            <defs>
              <radialGradient id="bg" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#3b1a6b" />
                <stop offset="60%" stopColor="#1a0b33" />
                <stop offset="100%" stopColor="#0b0518" />
              </radialGradient>
              <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffd166" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#ff7b39" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ff3d7f" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b07850" />
                <stop offset="100%" stopColor="#8a5a3a" />
              </linearGradient>
              <linearGradient id="white" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d9d4e8" />
              </linearGradient>
              <linearGradient id="kurta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdfbff" />
                <stop offset="100%" stopColor="#cfc6e6" />
              </linearGradient>
            </defs>
            <rect width="400" height="400" fill="url(#bg)" />
            <circle cx="200" cy="170" r="150" fill="url(#halo)" />

            {/* sound rays */}
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="200" y1="170" x2={200 + 190 * Math.cos((i * Math.PI) / 12)} y2={170 + 190 * Math.sin((i * Math.PI) / 12)}
                stroke={["#ff3d7f", "#ffd23f", "#2ec4b6", "#c77dff"][i % 4]} strokeOpacity="0.18" strokeWidth="2"
              />
            ))}

            {/* shoulders / white attire */}
            <path d="M60 400 C70 320 130 290 200 288 C270 290 330 320 340 400 Z" fill="url(#kurta)" />
            <path d="M200 290 L185 340 L200 400 L215 340 Z" fill="#e8e2f5" />
            {/* angavastram (shawl) */}
            <path d="M90 400 C110 330 150 300 178 296 L160 400 Z" fill="#f6c453" opacity="0.9" />
            <path d="M98 400 C116 336 152 306 176 300" stroke="#c0392b" strokeWidth="4" fill="none" />

            {/* neck */}
            <path d="M175 235 L225 235 L222 292 L178 292 Z" fill="url(#skin)" />

            {/* hair behind */}
            <path d="M118 150 C112 80 160 52 205 54 C255 56 292 92 284 152 C292 190 280 222 268 240 L132 240 C118 220 110 190 118 150 Z" fill="url(#white)" />

            {/* face */}
            <ellipse cx="200" cy="165" rx="66" ry="80" fill="url(#skin)" />
            {/* ears */}
            <ellipse cx="134" cy="170" rx="9" ry="17" fill="#9a6644" />
            <ellipse cx="266" cy="170" rx="9" ry="17" fill="#9a6644" />

            {/* swept-back hair top */}
            <path d="M136 125 C140 80 180 66 205 68 C238 70 266 88 266 128 C250 102 226 96 200 96 C172 96 150 104 136 125 Z" fill="url(#white)" />

            {/* vibhuti + kumkum */}
            <rect x="170" y="108" width="60" height="4" rx="2" fill="#fff" opacity="0.95" />
            <rect x="166" y="116" width="68" height="4" rx="2" fill="#fff" opacity="0.95" />
            <rect x="170" y="124" width="60" height="4" rx="2" fill="#fff" opacity="0.95" />
            <circle cx="200" cy="138" r="4.5" fill="#e63946" />

            {/* brows & eyes (serene, half-closed — lost in music) */}
            <path d="M160 150 Q175 143 190 150" stroke="#f1f1f1" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M210 150 Q225 143 240 150" stroke="#f1f1f1" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M163 163 Q176 170 189 163" stroke="#2b1a10" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M211 163 Q224 170 237 163" stroke="#2b1a10" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* nose */}
            <path d="M200 160 Q196 186 192 192 Q200 197 208 192" stroke="#6e4428" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* moustache & beard */}
            <path d="M136 185 C140 255 175 278 200 280 C225 278 260 255 264 185 C252 215 236 222 200 222 C164 222 148 215 136 185 Z" fill="url(#white)" />
            <path d="M172 207 C185 198 196 202 200 205 C204 202 215 198 228 207 C215 214 205 212 200 210 C195 212 185 214 172 207 Z" fill="#fafafa" />
            <path d="M188 222 Q200 228 212 222" stroke="#7a4b2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* harmonium keys */}
            <g transform="translate(70 352)">
              <rect width="260" height="40" rx="6" fill="#2a1646" stroke="#ffd23f" strokeOpacity=".6" />
              {Array.from({ length: 13 }).map((_, i) => (
                <rect key={i} x={6 + i * 19.1} y="6" width="17" height="30" rx="2" fill="#fffdf5" />
              ))}
              {[0, 1, 3, 4, 5, 7, 8, 10, 11].map((i) => (
                <rect key={i} x={18 + i * 19.1} y="6" width="10" height="18" rx="1.5" fill="#1a0b33" />
              ))}
            </g>

            {/* floating notes */}
            <g fontFamily="serif" fontWeight="700">
              <text x="48" y="90" fontSize="38" fill="#ffd23f">♪</text>
              <text x="320" y="78" fontSize="44" fill="#ff3d7f">♫</text>
              <text x="330" y="250" fontSize="34" fill="#2ec4b6">♩</text>
              <text x="40" y="260" fontSize="40" fill="#c77dff">♬</text>
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}
