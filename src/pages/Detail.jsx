import { useParams, useNavigate } from "react-router";
import { usePokemonService } from "../context/Context";

/* ── helpers ─────────────────────────────────────────── */
const fmt = (str) =>
  str
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") ?? "—";

const TYPE_COLORS = {
  normal:   { bg: "#A8A878", text: "#fff" },
  fire:     { bg: "#F08030", text: "#fff" },
  water:    { bg: "#6890F0", text: "#fff" },
  electric: { bg: "#F8D030", text: "#333" },
  grass:    { bg: "#78C850", text: "#fff" },
  ice:      { bg: "#98D8D8", text: "#333" },
  fighting: { bg: "#C03028", text: "#fff" },
  poison:   { bg: "#A040A0", text: "#fff" },
  ground:   { bg: "#E0C068", text: "#333" },
  flying:   { bg: "#A890F0", text: "#fff" },
  psychic:  { bg: "#F85888", text: "#fff" },
  bug:      { bg: "#A8B820", text: "#fff" },
  rock:     { bg: "#B8A038", text: "#fff" },
  ghost:    { bg: "#705898", text: "#fff" },
  dragon:   { bg: "#7038F8", text: "#fff" },
  dark:     { bg: "#705848", text: "#fff" },
  steel:    { bg: "#B8B8D0", text: "#333" },
  fairy:    { bg: "#EE99AC", text: "#333" },
};

const STAT_CONFIG = {
  hp:              { label: "HP",    color: "#ef4444" },
  attack:          { label: "ATK",   color: "#f97316" },
  defense:         { label: "DEF",   color: "#3b82f6" },
  "special-attack":  { label: "SpATK", color: "#a855f7" },
  "special-defense": { label: "SpDEF", color: "#14b8a6" },
  speed:           { label: "SPD",   color: "#eab308" },
};

/* ── sub-components ──────────────────────────────────── */

const TypeBadge = ({ type }) => {
  const col = TYPE_COLORS[type] ?? { bg: "#888", text: "#fff" };
  return (
    <span
      style={{
        background: col.bg,
        color: col.text,
        padding: "0.3rem 0.9rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        boxShadow: `0 2px 8px ${col.bg}66`,
      }}
    >
      {type}
    </span>
  );
};

const StatBar = ({ name, value }) => {
  const cfg = STAT_CONFIG[name] ?? { label: fmt(name), color: "#6b7280" };
  const pct = Math.min(100, Math.round((value / 255) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span
        style={{
          width: "3.5rem",
          fontSize: "0.65rem",
          fontWeight: 700,
          color: cfg.color,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {cfg.label}
      </span>

      <span
        style={{
          width: "2.25rem",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "#1f2937",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {value}
      </span>

      {/* track */}
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: cfg.color,
            borderRadius: "999px",
            transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      </div>

      <span
        style={{
          width: "2rem",
          fontSize: "0.65rem",
          color: "#9ca3af",
          flexShrink: 0,
        }}
      >
        /255
      </span>
    </div>
  );
};

const InfoPill = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.2rem",
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "0.75rem 1.25rem",
      flex: "1 1 auto",
      minWidth: "6rem",
    }}
  >
    <span style={{ fontSize: "0.65rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
      {label}
    </span>
    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>{value}</span>
  </div>
);

const AbilityTag = ({ name, isHidden }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.35rem",
      background: isHidden ? "#fef3c7" : "#eff6ff",
      border: `1px solid ${isHidden ? "#fbbf24" : "#bfdbfe"}`,
      borderRadius: "8px",
      padding: "0.35rem 0.75rem",
      fontSize: "0.8rem",
      fontWeight: 600,
      color: isHidden ? "#92400e" : "#1e40af",
    }}
  >
    {fmt(name)}
    {isHidden && (
      <span style={{ fontSize: "0.6rem", background: "#fbbf24", color: "#78350f", borderRadius: "4px", padding: "0.1rem 0.35rem", fontWeight: 700 }}>
        OCULTA
      </span>
    )}
  </div>
);

/* ── main component ──────────────────────────────────── */

export const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pokemonServiceInstance = usePokemonService();
  const pokemonData = pokemonServiceInstance.GetPokemonById(id);

  if (!pokemonData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1rem", gap: "1rem" }}>
        <div style={{ fontSize: "3rem" }}>⚠️</div>
        <p style={{ color: "#6b7280", fontSize: "1rem" }}>Pokémon no encontrado.</p>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: "0.5rem 1.5rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
        >
          Volver
        </button>
      </div>
    );
  }

  const types     = pokemonData.types?.map((t) => t?.type?.name).filter(Boolean) ?? [];
  const abilities = pokemonData.abilities ?? [];
  const stats     = pokemonData.stats ?? [];
  const moves     = pokemonData.moves?.slice(0, 12) ?? [];

  const primaryType  = types[0] ?? "normal";
  const primaryColor = TYPE_COLORS[primaryType]?.bg ?? "#ef4444";

  const imageUrl =
    pokemonData.sprites?.other?.["official-artwork"]?.front_default ||
    pokemonData.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;

  const shinyUrl =
    pokemonData.sprites?.other?.["official-artwork"]?.front_shiny ||
    pokemonData.sprites?.front_shiny;

  const weightKg  = pokemonData.weight  ? (pokemonData.weight / 10).toFixed(1)  : "—";
  const heightM   = pokemonData.height  ? (pokemonData.height / 10).toFixed(1)  : "—";
  const baseExp   = pokemonData.base_experience ?? "—";
  const idDisplay = pokemonData.id ? `#${String(pokemonData.id).padStart(3, "0")}` : "—";

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

      {/* ── HERO HEADER ── */}
      <div
        style={{
          background: `linear-gradient(160deg, ${primaryColor}22 0%, ${primaryColor}08 60%, transparent 100%)`,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: "white", border: "1px solid #e5e7eb", borderRadius: "8px",
              padding: "0.4rem 0.9rem", fontSize: "0.8rem", fontWeight: 600,
              color: "#374151", cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.15s",
            }}
          >
            ← Volver al catálogo
          </button>

          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-end", flexWrap: "wrap" }}>

            {/* Pokémon image */}
            <div
              style={{
                position: "relative",
                width: "200px",
                flexShrink: 0,
                alignSelf: "flex-end",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "160px",
                  height: "40px",
                  background: `radial-gradient(ellipse, ${primaryColor}30 0%, transparent 70%)`,
                  borderRadius: "50%",
                }}
              />
              <img
                src={imageUrl}
                alt={pokemonData.name}
                style={{
                  width: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.18))",
                  position: "relative",
                  zIndex: 1,
                  display: "block",
                }}
              />
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: "220px", paddingBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.15em", marginBottom: "0.25rem" }}>
                {idDisplay}
              </p>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", lineHeight: 1, marginBottom: "0.75rem" }}>
                {fmt(pokemonData.name)}
              </h1>

              {/* Type badges */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {types.map((t) => <TypeBadge key={t} type={t} />)}
              </div>

              {/* Quick stats pills */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <InfoPill label="Altura" value={`${heightM} m`} />
                <InfoPill label="Peso"   value={`${weightKg} kg`} />
                <InfoPill label="Exp. Base" value={baseExp} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* ── STATS ── */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "1.5rem",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "4px", height: "1.1rem", background: primaryColor, borderRadius: "2px", display: "inline-block" }} />
            Estadísticas base
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
            {/* Total */}
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ width: "3.5rem", fontSize: "0.65rem", fontWeight: 700, color: "#6b7280", textAlign: "right", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                TOTAL
              </span>
              <span style={{ width: "2.25rem", fontSize: "0.9rem", fontWeight: 800, color: "#111827", textAlign: "center" }}>
                {stats.reduce((acc, s) => acc + s.base_stat, 0)}
              </span>
              <div style={{ flex: 1, height: "8px", background: "#f3f4f6", borderRadius: "999px" }} />
            </div>
          </div>
        </div>

        {/* ── ABILITIES ── */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "1.5rem",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "4px", height: "1.1rem", background: primaryColor, borderRadius: "2px", display: "inline-block" }} />
            Habilidades
          </h2>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {abilities.map((a) => (
              <AbilityTag key={a.ability.name} name={a.ability.name} isHidden={a.is_hidden} />
            ))}
          </div>
        </div>

        {/* ── MOVES (preview) ── */}
        {moves.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "1.5rem",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "4px", height: "1.1rem", background: primaryColor, borderRadius: "2px", display: "inline-block" }} />
              Movimientos <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>(primeros 12)</span>
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {moves.map((m) => (
                <span
                  key={m.move.name}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "0.3rem 0.7rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {fmt(m.move.name)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── SPRITES ── */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "1.5rem",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "4px", height: "1.1rem", background: primaryColor, borderRadius: "2px", display: "inline-block" }} />
            Sprites
          </h2>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            {[
              { url: pokemonData.sprites?.front_default, label: "Normal" },
              { url: pokemonData.sprites?.back_default,  label: "Espalda" },
              { url: shinyUrl,                           label: "✨ Shiny" },
              { url: pokemonData.sprites?.front_female,  label: "♀ Hembra" },
            ]
              .filter((s) => s.url)
              .map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                  <div
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "0.5rem",
                      width: "80px",
                      height: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={s.url} alt={s.label} style={{ width: "64px", height: "64px", imageRendering: "pixelated" }} />
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Detail;
