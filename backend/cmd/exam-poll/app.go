package main

import (
	"fmt"
	"github.com/fugidev/exam-poll/backend/internal/app"
	"github.com/fugidev/exam-poll/backend/internal/cron"
	"github.com/fugidev/exam-poll/backend/internal/env"
)

func main() {

	env.InitEnv()

	go func() {
		err := cron.InitCron()
		if err != nil {
			fmt.Println(err)
		}
	}()
	app.InitiateExamPoll()
}
