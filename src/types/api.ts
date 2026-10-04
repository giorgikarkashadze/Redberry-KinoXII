export interface Format {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
}

export interface Venue {
  id: number;
  slug: string;
  name: string;
  city: string;
  formats: Format[];
}

export interface Language {
  id: number;
  slug: string;
  name: string;
  code: string;
}

export interface Genre {
  id: number;
  slug: string;
  name: string;
}

export interface AgeRating {
  code: string;
  minAge: number;
  description: string;
}

export interface TicketType {
  id: number;
  slug: string;
  name: string;
  priceRatio: number;
  note: string | null;
  blockedFromRatingAge: number | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  age: number | null;
  preferredVenue?: Venue | null;
  profileComplete: boolean;
}

export type MovieKind = "film" | "event";

export interface Movie {
  id: number;
  slug: string;
  title: string;
  kind: MovieKind;
  runtimeMinutes: number;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  isComingSoon: boolean;
  isFeatured: boolean;
  isNotified: boolean;
  fromPrice: number;
  ageRating: AgeRating;
  genres: Genre[];
  formats: Format[];
}

export interface MovieDetail extends Movie {
  synopsis: string;
  director: string | null;
  cast: string | null;
  availableDates: string[];
}

export type TimeBand = string;

export interface Hall {
  id: number;
  name: string;
}

export interface Session {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  timeBand: TimeBand;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: Hall;
  venue: Venue;
  format: Format;
  language: Language;
  movie: Movie;
}

export type SeatState =
  | "available"
  | "sold"
  | "held"
  | "unavailable";

export interface Seat {
  id: number;
  code: string;
  label: string;
  state: SeatState;
  aisleAfter: boolean;
  isMine: boolean;
}

export interface SeatRow {
  label: string;
  seats: Seat[];
}

export interface SeatSection {
  name: string;
  rows: SeatRow[];
}

export interface SeatMap {
  sessionId: number;
  hall: {
    id: number;
    name: string;
    venue: Venue;
  };
  sections: SeatSection[];
}

export interface HeldSeat {
  seatId: number;
  code: string;
  ticketType: {
    slug: string;
    name: string;
  };
  price: number;
}

export interface SeatHold {
  holdId: string;
  sessionId: number;
  expiresAt: string;
  secondsRemaining: number;
  isLive: boolean;
  subtotal: number;
  seats: HeldSeat[];
}

export interface OrderContact {
  fullName: string;
  email: string;
  mobileNumber: string;
}

export interface OrderTicket {
  id: number;
  seatCode: string;
  ticketType: {
    slug: string;
    name: string;
  };
  price: number;
}

export interface Order {
  id: number;
  reference: string;
  status: string;
  totalPrice: number;
  paidAt: string;
  refundedAt: string | null;
  isUpcoming: boolean;
  isRefundable: boolean;
  cardLastFour: string;
  contact: OrderContact;
  session: Session;
  tickets: OrderTicket[];
}

export interface ValidationError {
  message: string;
  errors: {
    [field: string]: string[];
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

export interface TimeBandOption {
  id: string;
  label: string;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface FilterOptions {
  venues: Venue[];
  formats: Format[];
  languages: Language[];
  timeBands: TimeBandOption[];
  sorts: SortOption[];
  ticketTypes: TicketType[];
  ageRatings: AgeRating[];
  maxSeatsPerOrder: number;
  holdMinutes: number;
}

export interface SessionGroup {
  movie: Movie;
  sessions: Session[];
}

export interface SessionsMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalSessions: number;
  totalMovies: number;
  date: string;
}