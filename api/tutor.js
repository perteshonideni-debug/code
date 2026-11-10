import { handleTutorRequest } from '../server/tutor-handler.js';

export default function tutor(req, res) {
  return handleTutorRequest(req, res);
}
