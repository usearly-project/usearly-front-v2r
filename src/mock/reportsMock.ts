import type {
  PopularGroupedReport,
  Suggestion,
  CoupDeCoeur,
} from "@src/types/Reports";

export const reportsMock: PopularGroupedReport[] = [
  {
    reportingId: "r1",
    subCategory: "Mémorisation de connexion défaillante",
    count: 3,
    status: "open",
    category: "Autre",
    siteUrl: "instagram.com",
    marque: "Instagram",
    createdAt: "2026-03-11T09:31:28.000Z",
    descriptions: [
      {
        id: "d1",
        reportingId: "r1",

        description: "Je ne peux plus recevoir mes messages",
        emoji: "😡",

        createdAt: "2026-03-11T09:31:28.000Z",

        author: {
          id: "u1",
          pseudo: "Enzo",
          avatar: null,
        },

        capture: null,
        marque: "Instagram",

        reactions: [
          {
            emoji: "🔥",
            count: 2,
            userIds: ["r1", "r2"],
          },
        ],
      },
    ],
  },
  {
    reportingId: "r2",
    subCategory: "Incohérence de signalements",
    count: 3,
    status: "open",
    category: "Autre",
    siteUrl: "zara.fr",
    marque: "zara",
    createdAt: "2026-03-11T09:31:28.000Z",
    descriptions: [
      {
        id: "d1",
        reportingId: "r1",

        description: "Je ne peux plus recevoir mes messages",
        emoji: "😡",

        createdAt: "2026-03-11T09:31:28.000Z",

        author: {
          id: "u1",
          pseudo: "Enzo",
          avatar: null,
        },

        capture: null,
        marque: "Instagram",

        reactions: [
          {
            emoji: "🔥",
            count: 2,
            userIds: ["u2", "u3"],
          },
        ],
      },
    ],
  },
];

export const cdcsMock: CoupDeCoeur[] = [
  {
    id: "cdc2",

    marque: "amazon",
    emplacement: "home",

    descriptionId: "desc-amazon-1",

    illustration: "",

    title: "Suivez votre colis en un clin d'œil",
    punchline: "Clarté instantanée Confiance retrouvée",
    emoji: "😍",

    description:
      "Le suivi de commande en temps réel me permet de savoir exactement où en est mon colis.",

    siteUrl: "amazon.fr",

    capture: null,

    createdAt: "2026-02-27T17:52:04.000Z",
    updatedAt: "2026-02-27T17:52:04.000Z",

    reactions: [],

    type: "coupdecoeur",

    author: {
      pseudo: "Roose",
      email: "roose@example.com",
      avatar: "",
    },

    meta: {
      axe: "typography",
      layoutType: "two-bubble",
      highlightedWords: ["Clarté"],
    },
  },

  {
    id: "cdc2",

    marque: "amazon",
    emplacement: "home",

    descriptionId: "desc-amazon-1",

    illustration: "",

    title: "Suivez votre colis en un clin d'œil",
    punchline: "Clarté instantanée Confiance retrouvée",
    emoji: "😍",

    description:
      "Le suivi de commande en temps réel me permet de savoir exactement où en est mon colis.",

    siteUrl: "amazon.fr",

    capture: null,

    createdAt: "2026-02-27T17:52:04.000Z",
    updatedAt: "2026-02-27T17:52:04.000Z",

    reactions: [],

    type: "coupdecoeur",

    author: {
      pseudo: "Roose",
      email: "roose@example.com",
      avatar: "",
    },

    meta: {
      axe: "typography",
      layoutType: "two-bubble",
      highlightedWords: ["Clarté"],
    },
  },
];

export const suggestionsMock: Suggestion[] = [
  {
    id: "s1",
    marque: "usearly",

    descriptionId: "desc-s1",

    emplacement: "category_page",

    emoji: "🤩",

    title: "Connecter feedbacks et réseaux",
    punchline: "Thèmes enrichis Engagement accru",

    illustration: "",

    description:
      "Relier Usearly au suivi de tes feedbacks aux réseaux sociaux.",

    siteUrl: "usearly.com",

    capture: null,

    meta: {
      axe: "emoji",
      layoutType: "two-bubble",
      highlightedWords: ["Thèmes"],
    },

    createdAt: "2026-03-12T15:50:39.000Z",
    updatedAt: "2026-03-12T15:50:39.000Z",

    reactions: [],

    type: "suggestion",

    duplicateCount: 0,

    author: {
      pseudo: "Voltaire",
      email: "voltaire@test.com",
      avatar: "",
    },
  },
];
