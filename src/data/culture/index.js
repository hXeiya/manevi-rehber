import { enrichArticleWithImages } from './articleImages';
import { HIKMET_ARTICLES } from './articles/hikmet-rehberleri';
import { HIKMET_KAVRAMLARI } from './articles/hikmet-kavramlari';
import { MANEVI_DUALAR } from './articles/manevi-dualar';

const RAW_ARTICLES = [
  ...HIKMET_ARTICLES.map(item => ({ ...item, type: 'rehber' })),
  ...HIKMET_KAVRAMLARI.map(item => ({ ...item, type: 'kavram' })),
  ...MANEVI_DUALAR.map(item => ({ ...item, type: 'dua' })),
];

export const CULTURE_CONTENT = RAW_ARTICLES.map(enrichArticleWithImages);

export function getCultureById(id) {
  return CULTURE_CONTENT.find((item) => item.id === id);
}
