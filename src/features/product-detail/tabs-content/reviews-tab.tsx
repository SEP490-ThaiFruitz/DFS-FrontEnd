import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { OverallRate, ProductDetailTypes } from "../product-detail.types";

const reviews = [
  {
    id: "1",
    author: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2025-03-15",
    title: "Sản phẩm tuyệt vời",
    content:
      "Việt quất sấy rất ngon, vị ngọt tự nhiên và không quá khô. Tôi thường trộn với ngũ cốc buổi sáng hoặc ăn trực tiếp như một món ăn nhẹ lành mạnh.",
    verified: true,
    images: [
      "https://nuts.com/images/auto/510/340/fit/assets/f9e3f741e9e7c3a0.jpg",
      "https://nuts.com/images/auto/510/340/fit/assets/g9e3f741e9e7c3a0.jpg",
    ],
    likes: 12,
  },
  {
    id: "2",
    author: "Trần Thị B",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "2025-03-10",
    title: "Chất lượng tốt",
    content:
      "Sản phẩm chất lượng tốt, đóng gói cẩn thận. Tôi chỉ tiếc là giá hơi cao một chút so với các sản phẩm tương tự trên thị trường.",
    verified: true,
    images: [],
    likes: 5,
  },
  {
    id: "3",
    author: "Lê Văn C",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2025-03-05",
    title: "Rất hài lòng",
    content:
      "Đây là lần thứ ba tôi mua sản phẩm này và vẫn rất hài lòng. Việt quất sấy giữ được hương vị tự nhiên, không có chất bảo quản và rất tốt cho sức khỏe.",
    verified: true,
    images: [
      "https://nuts.com/images/auto/510/340/fit/assets/h9e3f741e9e7c3a0.jpg",
    ],
    likes: 8,
  },
];

interface ReviewsTabProps {
  overallRatingResponse: OverallRate;
}

export const ReviewsTab = memo(({ overallRatingResponse }: ReviewsTabProps) => {
  return (
    <div className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-lg shadow-sm cardStyle">
            <h3 className="text-lg font-semibold mb-4">Đánh giá tổng quan</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold text-sky-600">
                {overallRatingResponse?.overallRating ?? 0}
              </div>
              <div className="flex flex-col">
                <div className="flex text-amber-500">
                  <Star className="h-5 w-5 fill-amber-500" />
                  <Star className="h-5 w-5 fill-amber-500" />
                  <Star className="h-5 w-5 fill-amber-500" />
                  <Star className="h-5 w-5 fill-amber-500" />
                  <Star className="h-5 w-5 fill-amber-500 text-gray-200" />
                </div>
                <span className="text-sm text-slate-600">
                  Dựa trên {overallRatingResponse?.quantityFeedback ?? 0} đánh
                  giá
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-sm w-2">5</div>
                <Progress value={66} className="h-2" />
                <div className="text-sm w-8">
                  {overallRatingResponse?.fiveStar ?? 0}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-2">4</div>
                <Progress value={33} className="h-2" />
                <div className="text-sm w-8">
                  {overallRatingResponse?.fourStar ?? 0}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-2">3</div>
                <Progress value={0} className="h-2" />
                <div className="text-sm w-8">
                  {overallRatingResponse?.threeStar ?? 0}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-2">2</div>
                <Progress value={0} className="h-2" />
                <div className="text-sm w-8">
                  {overallRatingResponse?.twoStar ?? 0}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-2">1</div>
                <Progress value={0} className="h-2" />
                <div className="text-sm w-8">
                  {overallRatingResponse?.oneStar ?? 0}%
                </div>
              </div>
            </div>

            <Button className="w-full mt-6 bg-sky-600 hover:bg-sky-700">
              Viết đánh giá
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-4">Đánh giá từ khách hàng</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="shadow-sm hover:shadow-md transition-shadow cardStyle"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>
                          {review.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 border-green-200"
                            >
                              Đã mua hàng
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatTimeVietNam(new Date(review.date))}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-amber-500"
                              : "fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-4">{review.content}</p>

                  {review.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 rounded-md overflow-hidden"
                        >
                          <Image
                            src={image || "/images/second-background.png"}
                            alt={`Review image ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-sky-600"
                    >
                      <Heart className="h-4 w-4 mr-1" /> Hữu ích ({review.likes}
                      )
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-sky-600"
                    >
                      Báo cáo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ReviewsTab.displayName = "ReviewsTab";
