import {
  BookOpen,
  Sprout,
  Sparkles,
  Heart,
  Music,
  Users,
  Palette,
  Home,
  Globe,
  ArrowRight,
} from "lucide-react";

export function LearningScene() {
  return (
    <section id="learning" data-chapter="origin" className="lc-section jc-scene jc-learning">
      <header>
        <span className="lc-eyebrow">HỌC HỎI · TRẢI NGHIỆM · TRƯỞNG THÀNH</span>
        <h2>
          Mỗi trải nghiệm
          <br />
          <em>mở ra một chân trời.</em>
        </h2>
        <p>
          Vũ trụ là môi trường để học hỏi. Kiến thức trở thành phẩm chất qua những điều bạn thực sự
          trải nghiệm.
        </p>
      </header>
      <div className="jc-learning-path">
        {[
          [BookOpen, "Học hỏi", "Mở rộng hiểu biết"],
          [Sprout, "Trải nghiệm", "Sống, thử và khám phá"],
          [Sparkles, "Trưởng thành", "Nuôi dưỡng phẩm chất"],
        ].map(([Icon, title, desc], i) => {
          const I = Icon as typeof BookOpen;
          return (
            <article key={String(title)} style={{ animationDelay: `-${i * 2}s` }}>
              <I aria-hidden="true" />
              <h3>{String(title)}</h3>
              <p>{String(desc)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
export function WorkshopScene({ onCreate }: { onCreate: () => void }) {
  return (
    <section id="workshop" data-chapter="explore" className="lc-section jc-scene jc-workshop">
      <header>
        <span className="lc-eyebrow">THIẾT KẾ & SÁNG TẠO</span>
        <h2>
          Một ý tưởng.
          <br />
          <em>Một nơi để thuộc về.</em>
        </h2>
        <p>Từ ngôi nhà bạn hình dung đến một không gian để mọi người gặp gỡ, học hỏi và chia sẻ.</p>
      </header>
      <div className="jc-build">
        <div className="jc-blueprint">
          <Home size={100} strokeWidth={1} />
          <span>Ngôi nhà của bạn</span>
          <div>
            <span>Kiến trúc</span>
            <span>Nội thất</span>
            <span>Cảnh quan</span>
          </div>
        </div>
        <ArrowRight className="jc-build-arrow" />
        <div className="jc-destination">
          <img src="/cosmos/lovehub.png" alt="LoveHUB" loading="lazy" />
          <h3>Không gian kết nối</h3>
          <p>Chỗ ở · Bữa ăn · Tình người</p>
        </div>
      </div>
      <button className="lc-gold" onClick={onCreate}>
        Phác thảo không gian của bạn <Palette size={18} />
      </button>
    </section>
  );
}
export function ContributionScene() {
  const items = [
    [BookOpen, "Hoàn thành bài học"],
    [Palette, "Hoàn thiện một thiết kế"],
    [Sprout, "Trồng một cây thật"],
    [Users, "Giúp người chơi mới"],
    [Heart, "Tham gia cộng đồng"],
    [Globe, "Chia sẻ nội dung hữu ích"],
  ] as const;
  return (
    <section
      id="contributions"
      data-chapter="love"
      className="lc-section jc-scene jc-contributions"
    >
      <header>
        <span className="lc-eyebrow">NHỮNG GIÁ TRỊ BẠN TẠO RA</span>
        <h2>
          Lòng tốt để lại
          <br />
          <em>những dấu chân.</em>
        </h2>
        <p>
          Mỗi hoạt động có cách xác minh phù hợp. Những đóng góp được ghi nhận làm nên lịch sử hành
          trình của bạn.
        </p>
      </header>
      <div className="jc-constellation">
        {items.map(([I, t]) => (
          <article key={t}>
            <I aria-hidden="true" />
            <h3>{t}</h3>
          </article>
        ))}
      </div>
      <p className="jc-note">Minh bạch · Công bằng · Có thể truy vết</p>
    </section>
  );
}
export function FunScene() {
  return (
    <section id="together" data-chapter="about" className="lc-section jc-scene jc-together">
      <header>
        <span className="lc-eyebrow">NIỀM VUI TRONG MỖI HÀNH TRÌNH</span>
        <h2>
          Cùng chơi.
          <br />
          <em>Cùng tạo kỷ niệm.</em>
        </h2>
        <p>
          Khám phá thế giới, gặp bạn bè, tham gia sự kiện và tạo nên những điều chỉ riêng bạn có thể
          mang đến.
        </p>
      </header>
      <div className="jc-festival">
        <article>
          <Music />
          <h3>Âm nhạc</h3>
          <p>Những giai điệu kết nối mọi người.</p>
        </article>
        <article>
          <Sparkles />
          <h3>Sự kiện</h3>
          <p>Trải nghiệm mới để cùng khám phá.</p>
        </article>
        <article>
          <Users />
          <h3>Bạn bè</h3>
          <p>Cộng đồng cùng chơi và cùng lớn lên.</p>
        </article>
      </div>
    </section>
  );
}
