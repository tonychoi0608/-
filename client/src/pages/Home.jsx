import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, CalendarHeart, Loader2, MessageSquareQuote } from "lucide-react";

import { useFeedbacks, useCreateFeedback } from "@/hooks/use-feedbacks";
import { insertFeedbackSchema } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  const { data: feedbacks, isLoading } = useFeedbacks();
  const { mutate: createFeedback, isPending } = useCreateFeedback();

  const form = useForm({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      name: "",
      content: "",
    },
  });

  const onSubmit = (data) => {
    createFeedback(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const getInitials = (name) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-background pb-20">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-orange-400/10 blur-[100px]" />
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-4 shadow-sm">
            <CalendarHeart className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 font-display">
            효도달력 테스트 보드
          </h1>
          <p className="text-muted-foreground text-lg px-4">
            앱을 사용해보시고 불편한 점이나 좋은 아이디어를 자유롭게 남겨주세요.
            <br className="hidden sm:block" />
            여러분의 작은 의견이 큰 변화를 만듭니다!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="glass-panel border-none rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-orange-400/40 to-primary/40" />
            
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    테스터 이름 (또는 닉네임)
                  </label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    data-testid="input-name"
                    className={`h-12 bg-white/50 backdrop-blur-sm rounded-xl border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200 ${
                      form.formState.errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""
                    }`}
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1.5 ml-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-semibold text-foreground mb-2">
                    어떤 점이 좋았거나 불편하셨나요?
                  </label>
                  <Textarea
                    id="content"
                    placeholder="예: 글씨가 더 컸으면 좋겠어요. / 음성 알림 기능이 정말 편하네요!"
                    data-testid="input-content"
                    className={`min-h-[120px] resize-y bg-white/50 backdrop-blur-sm rounded-xl border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200 text-base py-3 ${
                      form.formState.errors.content ? "border-destructive focus-visible:ring-destructive/20" : ""
                    }`}
                    {...form.register("content")}
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-destructive mt-1.5 ml-1">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending}
                  data-testid="button-submit"
                  className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      의견 등록중...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      의견 남기기
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold font-display text-foreground flex items-center">
              <MessageSquareQuote className="w-5 h-5 mr-2 text-primary" />
              테스터 의견 모음
              {feedbacks && feedbacks.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                  {feedbacks.length}
                </span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl border-none shadow-[var(--shadow-subtle)]">
                  <CardContent className="p-6 flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="space-y-3 w-full">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : feedbacks && feedbacks.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {feedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card data-testid={`card-feedback-${feedback.id}`} className="rounded-2xl border-none shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-float)] transition-shadow duration-300 bg-white">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start gap-4 sm:gap-5">
                          
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary/10">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-orange-400/20 text-primary font-bold">
                              {getInitials(feedback.name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1">
                              <h3 className="font-bold text-foreground truncate text-base sm:text-lg" data-testid={`text-name-${feedback.id}`}>
                                {feedback.name}
                              </h3>
                              <time className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap bg-secondary/50 px-2 py-0.5 rounded-md w-fit">
                                {feedback.createdAt ? formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true, locale: ko }) : '방금 전'}
                              </time>
                            </div>
                            
                            <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base bg-secondary/20 p-4 rounded-xl mt-3" data-testid={`text-content-${feedback.id}`}>
                              {feedback.content}
                            </div>
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-border"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">첫 번째 의견을 남겨주세요!</h3>
              <p className="text-muted-foreground">
                아직 등록된 테스트 피드백이 없습니다.<br />
                여러분의 소중한 첫 의견을 기다립니다.
              </p>
            </motion.div>
          )}
        </div>

      </main>
    </div>
  );
}
