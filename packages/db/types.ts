import type { ColumnType } from "kysely";

export type FeedbackCategory = "bug" | "feature" | "login" | "other";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type HappeningType = "bedpres" | "event" | "external";

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type QuestionType = "checkbox" | "radio" | "text" | "textarea";

export type RegistrationStatus = "pending" | "registered" | "removed" | "unregistered" | "waiting";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserType = "alum" | "company" | "guest" | "student";

export interface AccessRequest {
  created_at: Generated<Timestamp>;
  email: string;
  id: string;
  reason: string;
}

export interface Account {
  access_token: string | null;
  expires_at: number | null;
  id_token: string | null;
  provider: string;
  provider_account_id: string;
  refresh_token: string | null;
  scope: string | null;
  session_state: string | null;
  token_type: string | null;
  type: string;
  user_id: string;
}

export interface Answer {
  answer: Json | null;
  happening_id: string;
  question_id: string;
  user_id: string;
}

export interface Comment {
  content: string;
  created_at: Generated<Timestamp>;
  id: string;
  parent_comment_id: string | null;
  post_id: string;
  updated_at: Timestamp;
  user_id: string | null;
}

export interface Degree {
  id: string;
  name: string;
}

export interface DrizzleDrizzleMigrations {
  created_at: Int8 | null;
  hash: string;
  id: Generated<number>;
}

export interface Group {
  id: string;
  name: string;
}

export interface Happening {
  date: Timestamp | null;
  id: string;
  registration_end: Timestamp | null;
  registration_groups: Json | null;
  registration_start: Timestamp | null;
  registration_start_groups: Timestamp | null;
  slug: string;
  title: string;
  type: Generated<HappeningType>;
}

export interface HappeningsToGroups {
  group_id: string;
  happening_id: string;
}

export interface Kv {
  key: string;
  ttl: Generated<Timestamp | null>;
  value: Json | null;
}

export interface Question {
  happening_id: string;
  id: string;
  is_sensitive: Generated<boolean>;
  options: Json | null;
  required: Generated<boolean>;
  title: string;
  type: Generated<QuestionType>;
}

export interface Reaction {
  created_at: Generated<Timestamp>;
  emoji_id: number;
  react_to_key: string;
  user_id: string;
}

export interface Registration {
  changed_at: Timestamp | null;
  changed_by: string | null;
  created_at: Generated<Timestamp>;
  happening_id: string;
  prev_status: RegistrationStatus | null;
  status: Generated<RegistrationStatus>;
  unregister_reason: string | null;
  user_id: string;
}

export interface Session {
  expires: Timestamp;
  session_token: string;
  user_id: string;
}

export interface ShoppingListItem {
  created_at: Generated<Timestamp>;
  id: Generated<string>;
  name: string;
  user_id: string;
}

export interface SiteFeedback {
  category: FeedbackCategory;
  created_at: Generated<Timestamp>;
  email: string | null;
  id: string;
  is_read: Generated<boolean>;
  message: string;
  name: string | null;
}

export interface SpotRange {
  happening_id: string;
  id: string;
  max_year: number;
  min_year: number;
  spots: number;
}

export interface Strike {
  id: Generated<number>;
  is_deleted: Generated<boolean>;
  strike_info_id: string;
  user_id: string;
}

export interface StrikeInfo {
  created_at: Generated<Timestamp>;
  happening_id: string;
  id: Generated<string>;
  issuer_id: string;
  reason: string;
}

export interface User {
  alternative_email: string | null;
  banned_from_strike: number | null;
  degree_id: string | null;
  email: string;
  email_verified: Timestamp | null;
  id: string;
  image: string | null;
  is_banned: Generated<boolean>;
  name: string | null;
  type: Generated<UserType>;
  year: number | null;
}

export interface UsersToGroups {
  group_id: string;
  is_leader: Generated<boolean>;
  user_id: string;
}

export interface UsersToShoppingListItems {
  created_at: Generated<Timestamp>;
  item_id: string;
  user_id: string;
}

export interface VerificationToken {
  expires: Timestamp;
  identifier: string;
  token: string;
}

export interface Whitelist {
  email: string;
  expires_at: Timestamp;
  reason: string;
}

export interface DB {
  access_request: AccessRequest;
  account: Account;
  answer: Answer;
  comment: Comment;
  degree: Degree;
  "drizzle.__drizzle_migrations": DrizzleDrizzleMigrations;
  group: Group;
  happening: Happening;
  happenings_to_groups: HappeningsToGroups;
  kv: Kv;
  question: Question;
  reaction: Reaction;
  registration: Registration;
  session: Session;
  shopping_list_item: ShoppingListItem;
  site_feedback: SiteFeedback;
  spot_range: SpotRange;
  strike: Strike;
  strike_info: StrikeInfo;
  user: User;
  users_to_groups: UsersToGroups;
  users_to_shopping_list_items: UsersToShoppingListItems;
  verification_token: VerificationToken;
  whitelist: Whitelist;
}
