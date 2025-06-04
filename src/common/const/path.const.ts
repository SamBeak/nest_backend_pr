import { join } from "path";

export const PROJECT_ROOT_PATH = process.cwd(); // nest_backend_pr
export const PUBLIC_FOLDER_NAME = "public"; // 외부에서 접근할 수 있는 폴더
export const POSTS_FOLDER_NAME = "posts"; // 게시글 이미지가 저장되는 폴더

export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME); // 외부에서 접근할 수 있는 폴더의 전체 경로
export const POSTS_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME); // 게시글 이미지가 저장되는 폴더의 전체 경로

export const POST_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, POSTS_FOLDER_NAME); // 게시글 이미지가 저장되는 폴더의 상대 경로