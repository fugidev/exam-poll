package env

import (
	"github.com/joho/godotenv"
	"os"
	"log"
)

var (
	ExamCollection = ""
	ExamDatabase   = ""
	ExamUri        = ""
)

func InitEnv() {
	err := godotenv.Load(".env.dev")
	if err != nil {
		log.Println(err)
	}
	ExamCollection = os.Getenv("EXAM_POLL_COLLECTION")
	ExamDatabase = os.Getenv("EXAM_POLL_DATABASE")
	ExamUri = os.Getenv("EXAM_POLL_MONGODB")
}
