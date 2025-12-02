import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type ContentItem = {
  id: number;
  type: 'music' | 'cover' | 'text';
  title: string;
  creator: string;
  price: number;
  likes: number;
  image: string;
  trending?: boolean;
};

type CartItem = ContentItem & { quantity: number };

export default function Index() {
  const [activeSection, setActiveSection] = useState<'home' | 'catalog' | 'recommendations' | 'tops' | 'profile' | 'cart' | 'favorites' | 'create'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notifications] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  const mockContent: ContentItem[] = [
    { id: 1, type: 'music', title: 'Летний Вайб', creator: 'DJ Alex', price: 2500, likes: 1243, image: '/placeholder.svg', trending: true },
    { id: 2, type: 'cover', title: 'Минимал Арт', creator: 'ArtistPro', price: 1800, likes: 892, image: '/placeholder.svg' },
    { id: 3, type: 'text', title: 'Про Любовь', creator: 'PoetMind', price: 1200, likes: 634, image: '/placeholder.svg', trending: true },
    { id: 4, type: 'music', title: 'Электро Ритм', creator: 'BeatMaker', price: 3000, likes: 2103, image: '/placeholder.svg' },
    { id: 5, type: 'cover', title: 'Градиент Неон', creator: 'DesignKing', price: 2200, likes: 1456, image: '/placeholder.svg', trending: true },
    { id: 6, type: 'text', title: 'Мотивация', creator: 'WordSmith', price: 1500, likes: 789, image: '/placeholder.svg' },
  ];

  const addToCart = (item: ContentItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'music': return 'Music';
      case 'cover': return 'Image';
      case 'text': return 'FileText';
      default: return 'Package';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'music': return 'from-purple-500 to-pink-500';
      case 'cover': return 'from-orange-500 to-blue-500';
      case 'text': return 'from-blue-600 to-cyan-400';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const platformFee = cartTotal * 0.05;
  const creatorEarnings = cartTotal - platformFee;

  const ContentCard = ({ item }: { item: ContentItem }) => (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 animate-fade-in aspect-square">
      <div className="relative w-full h-full flex flex-col">
        <div className="relative flex-1 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(item.type)} opacity-80`}></div>
          <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-overlay" />
          
          {item.trending && (
            <Badge className="absolute top-3 left-3 bg-gradient-primary text-white border-0 animate-pulse-glow">
              🔥 Trending
            </Badge>
          )}
          
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
            onClick={() => toggleFavorite(item.id)}
          >
            <Icon name="Heart" className={favorites.includes(item.id) ? 'fill-red-500 text-red-500' : ''} size={20} />
          </Button>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-sm text-xs">
              <Icon name={getTypeIcon(item.type)} size={12} className="mr-1" />
              {item.type === 'music' ? 'Музыка' : item.type === 'cover' ? 'Обложка' : 'Текст'}
            </Badge>
          </div>
        </div>

        <div className="p-3 bg-card">
          <h3 className="font-heading font-bold text-base mb-1 text-foreground truncate">{item.title}</h3>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1 truncate">
            <Icon name="User" size={12} />
            {item.creator}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="Heart" size={12} />
                {item.likes}
              </span>
              <span className="font-heading font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                {item.price}₽
              </span>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:opacity-90 text-white border-0 h-8 w-8 p-0"
              onClick={() => addToCart(item)}
            >
              <Icon name="ShoppingCart" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <h1 className="font-heading font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
                CreativeHub
              </h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input 
                  placeholder="Поиск музыки, обложек, текстов..."
                  className="pl-10 bg-muted border-border focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
                onClick={() => setActiveSection('cart')}
              >
                <Icon name="ShoppingCart" size={22} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-secondary text-white border-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
              >
                <Icon name="Bell" size={22} />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-secondary text-white border-0 text-xs animate-pulse-glow">
                    {notifications}
                  </Badge>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setActiveSection('profile')}
              >
                <Avatar className="h-8 w-8 border-2 border-primary">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-primary text-white">ТЫ</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>

          <nav className="flex gap-1 mt-4 overflow-x-auto pb-2">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'catalog', label: 'Каталог', icon: 'Grid3x3' },
              { id: 'recommendations', label: 'Рекомендации', icon: 'Sparkles' },
              { id: 'tops', label: 'Топы', icon: 'TrendingUp' },
              { id: 'favorites', label: 'Избранное', icon: 'Heart' },
              { id: 'create', label: 'Создать', icon: 'Plus' },
            ].map((nav) => (
              <Button
                key={nav.id}
                variant={activeSection === nav.id ? 'default' : 'ghost'}
                className={activeSection === nav.id ? 'bg-gradient-primary text-white hover:opacity-90' : ''}
                onClick={() => setActiveSection(nav.id as any)}
              >
                <Icon name={nav.icon as any} size={18} className="mr-2" />
                {nav.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <section className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 border border-primary/30">
              <div className="relative z-10 max-w-2xl">
                <Badge className="mb-4 bg-gradient-secondary text-white border-0">Топ творцов недели 🎨</Badge>
                <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                  Маркетплейс для <span className="bg-gradient-primary bg-clip-text text-transparent">творцов</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Продавайте музыку, обложки и тексты. Находите уникальный контент для своих проектов.
                </p>
                <div className="flex gap-3">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white border-0">
                    <Icon name="Rocket" size={20} className="mr-2" />
                    Начать продавать
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                    Смотреть топы
                  </Button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl">🔥 Trending сейчас</h2>
                <Button variant="ghost" className="text-primary">
                  Смотреть всё <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockContent.filter(item => item.trending).map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl">✨ Новинки</h2>
                <Button variant="ghost" className="text-primary">
                  Смотреть всё <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockContent.slice(0, 3).map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'catalog' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <h2 className="font-heading font-bold text-3xl">Каталог</h2>
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList className="bg-muted">
                  <TabsTrigger value="all">Всё</TabsTrigger>
                  <TabsTrigger value="music">Музыка</TabsTrigger>
                  <TabsTrigger value="cover">Обложки</TabsTrigger>
                  <TabsTrigger value="text">Тексты</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'recommendations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-3xl">Рекомендации для вас</h2>
                <p className="text-muted-foreground">На основе ваших интересов</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockContent.slice(0, 6).map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'tops' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-3xl">Топ творцов</h2>
                <p className="text-muted-foreground">Самые популярные работы</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...mockContent].sort((a, b) => b.likes - a.likes).map((item, idx) => (
                <div key={item.id} className="relative">
                  {idx < 3 && (
                    <Badge className="absolute -top-2 -left-2 z-10 bg-gradient-secondary text-white border-0 text-lg w-10 h-10 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </Badge>
                  )}
                  <ContentCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'favorites' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-heading font-bold text-3xl flex items-center gap-3">
              <Icon name="Heart" className="text-red-500" size={32} />
              Избранное
            </h2>
            {favorites.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="Heart" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-heading font-bold text-xl mb-2">Пока пусто</h3>
                <p className="text-muted-foreground mb-4">Добавьте понравившиеся работы в избранное</p>
                <Button onClick={() => setActiveSection('catalog')} className="bg-gradient-primary text-white border-0">
                  Перейти в каталог
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockContent.filter(item => favorites.includes(item.id)).map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'cart' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-heading font-bold text-3xl flex items-center gap-3">
              <Icon name="ShoppingCart" size={32} />
              Корзина
            </h2>
            {cart.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-heading font-bold text-xl mb-2">Корзина пуста</h3>
                <p className="text-muted-foreground mb-4">Добавьте работы творцов в корзину</p>
                <Button onClick={() => setActiveSection('catalog')} className="bg-gradient-primary text-white border-0">
                  Перейти в каталог
                </Button>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="p-4 flex gap-4">
                      <div className={`w-24 h-24 rounded-lg bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center`}>
                        <Icon name={getTypeIcon(item.type)} size={32} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.creator}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-bold text-lg">{item.price}₽</span>
                          <Badge variant="outline">x{item.quantity}</Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                      >
                        <Icon name="Trash2" size={20} />
                      </Button>
                    </Card>
                  ))}
                </div>
                
                <Card className="p-6 h-fit space-y-4 gradient-border">
                  <h3 className="font-heading font-bold text-xl">Итого</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Стоимость работ</span>
                      <span className="font-bold">{cartTotal}₽</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Комиссия платформы (5%)</span>
                      <span>-{platformFee.toFixed(0)}₽</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Творцы получат</span>
                      <span className="text-green-500 font-bold">{creatorEarnings.toFixed(0)}₽</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between mb-4">
                      <span className="font-heading font-bold text-lg">К оплате</span>
                      <span className="font-heading font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
                        {cartTotal}₽
                      </span>
                    </div>
                    <Button className="w-full bg-gradient-primary hover:opacity-90 text-white border-0 h-12 text-lg">
                      <Icon name="CreditCard" size={20} className="mr-2" />
                      Оплатить через СберБанк
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 border-primary/30">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="w-24 h-24 border-4 border-primary">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-primary text-white text-3xl">ТЫ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading font-bold text-3xl">Твой Профиль</h2>
                    <Badge className="bg-gradient-secondary text-white border-0">⭐ Проверен</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">Творец • Музыкант • Дизайнер</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <div className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">127</div>
                      <div className="text-muted-foreground">Продаж</div>
                    </div>
                    <div>
                      <div className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">4.8★</div>
                      <div className="text-muted-foreground">Рейтинг</div>
                    </div>
                    <div>
                      <div className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">23</div>
                      <div className="text-muted-foreground">Работы</div>
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-primary text-white border-0">
                  <Icon name="Settings" size={18} className="mr-2" />
                  Настройки
                </Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 text-center gradient-border">
                <Icon name="DollarSign" size={32} className="mx-auto mb-2 text-green-500" />
                <div className="font-heading font-bold text-2xl mb-1">45 890₽</div>
                <div className="text-sm text-muted-foreground">Заработано</div>
              </Card>
              <Card className="p-6 text-center gradient-border">
                <Icon name="TrendingUp" size={32} className="mx-auto mb-2 text-blue-500" />
                <div className="font-heading font-bold text-2xl mb-1">+34%</div>
                <div className="text-sm text-muted-foreground">Рост за месяц</div>
              </Card>
              <Card className="p-6 text-center gradient-border">
                <Icon name="Users" size={32} className="mx-auto mb-2 text-purple-500" />
                <div className="font-heading font-bold text-2xl mb-1">892</div>
                <div className="text-sm text-muted-foreground">Подписчики</div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Package" size={24} />
                Мои работы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockContent.slice(0, 3).map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'create' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 border-primary/30">
              <h2 className="font-heading font-bold text-3xl mb-2 flex items-center gap-3">
                <Icon name="Plus" size={32} />
                Создать работу
              </h2>
              <p className="text-muted-foreground mb-6">Загрузите свою музыку, обложку или текст для продажи</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Тип работы</label>
                  <Tabs defaultValue="music" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted">
                      <TabsTrigger value="music">
                        <Icon name="Music" size={18} className="mr-2" />
                        Музыка
                      </TabsTrigger>
                      <TabsTrigger value="cover">
                        <Icon name="Image" size={18} className="mr-2" />
                        Обложка
                      </TabsTrigger>
                      <TabsTrigger value="text">
                        <Icon name="FileText" size={18} className="mr-2" />
                        Текст
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <Input placeholder="Введите название работы" className="bg-muted border-border" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Input placeholder="Краткое описание" className="bg-muted border-border" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Цена (₽)</label>
                  <Input type="number" placeholder="2500" className="bg-muted border-border" />
                  <p className="text-xs text-muted-foreground mt-1">Вы получите 95% от суммы продажи</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Файл</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/50">
                    <Icon name="Upload" size={48} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Нажмите или перетащите файл сюда</p>
                    <p className="text-xs text-muted-foreground mt-1">MP3, PNG, JPG, TXT до 50MB</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-primary hover:opacity-90 text-white border-0 h-12">
                    <Icon name="Rocket" size={20} className="mr-2" />
                    Опубликовать
                  </Button>
                  <Button variant="outline" className="border-border">
                    Отменить
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">CreativeHub © 2024 • Маркетплейс для творцов</p>
        </div>
      </footer>
    </div>
  );
}