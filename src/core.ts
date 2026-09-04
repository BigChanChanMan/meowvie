import type { TMDBQueryParams, MovieResultItem, MovieCredits } from '@lorenzopant/tmdb';
import { tmdb } from './config';
import type { Detail, BoardKey } from './config';

export type CoreParams = TMDBQueryParams;

function client() {
  if (!tmdb) throw new Error('未配置 TMDB_ACCESS_TOKEN（编辑 .env 文件）');
  return tmdb;
}

export async function searchMovies(query: string, params: CoreParams = {}): Promise<MovieResultItem[]> {
  const r = await client().search.movies({ query, ...params });
  return r.results;
}

export async function listMovies(key: BoardKey, params: CoreParams = {}): Promise<MovieResultItem[]> {
  const r = await client().movie_lists[key](params);
  return r.results;
}

export async function movieDetail(id: number, params: CoreParams = {}): Promise<Detail> {
  return client().movies.details<['credits']>({
    movie_id: id,
    language: params.language,
    append_to_response: ['credits'],
  });
}

export async function movieCredits(id: number, params: CoreParams = {}): Promise<MovieCredits> {
  return (await movieDetail(id, params)).credits;
}

export type Core = {
  search: typeof searchMovies;
  list: typeof listMovies;
  movie: typeof movieDetail;
  credits: typeof movieCredits;
};

export const core: Core = {
  search: searchMovies,
  list: listMovies,
  movie: movieDetail,
  credits: movieCredits,
};
