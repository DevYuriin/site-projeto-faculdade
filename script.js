window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  renderContentPage();
  renderExercisePage();
  renderDashboardPage();
  initDashboardActions();
  initTabs();
  initTopicToggles();
  initQuizzes();
  updateGamification();
});

window.addEventListener("pageshow", () => {
  document.body.classList.add("loaded");
});

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (event) {
    const href = this.getAttribute("href");

    if (!href || href.startsWith("#") || this.target === "_blank") {
      return;
    }

    event.preventDefault();
    document.body.classList.remove("loaded");

    setTimeout(() => {
      window.location.href = href;
    }, 600);
  });
});

const PROGRESS_STORAGE_KEY = "studyProgressV2";

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  if (!tabs.length || !contents.length) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.tab);
    });
  });

  document.querySelectorAll("[data-open-tab]").forEach((link) => {
    link.addEventListener("click", () => {
      activateTab(link.dataset.openTab);
    });
  });
}

function activateTab(tabId) {
  if (!tabId) {
    return;
  }

  document.querySelectorAll(".tab").forEach((item) => {
    item.classList.toggle("active", item.dataset.tab === tabId);
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.toggle("active", content.id === tabId);
  });
}

function initTopicToggles() {
  document.querySelectorAll(".topic-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const href = button.getAttribute("href");

      if (!href?.startsWith("#")) {
        return;
      }

      const targetId = href.replace("#", "");

      if (!targetId) {
        return;
      }

      event.preventDefault();

      if (button.dataset.openTab) {
        activateTab(button.dataset.openTab);
      }

      window.setTimeout(() => {
        const target = document.getElementById(targetId);

        if (!target) {
          return;
        }

        const currentTab = target.closest(".tab-content") || document;

        currentTab.querySelectorAll(".lesson-detail.is-open, .quiz-container.is-open").forEach((panel) => {
          if (panel !== target) {
            panel.classList.remove("is-open");
          }
        });

        target.classList.toggle("is-open");

        if (target.classList.contains("is-open")) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    });
  });
}

const SUBJECTS = {
  portugues: {
    name: "Português",
    badge: "Pt",
    area: "Linguagens",
    className: "page-portugues",
    exercise: "portugues-basico",
    topics: {
      alfabeto: {
        title: "Alfabeto e fonética",
        level: "Básico",
        summary: "Entenda as letras, os sons da fala, vogais, consoantes e sílabas.",
        content: "O alfabeto é o conjunto de letras usado para escrever as palavras. A fonética observa os sons produzidos na fala. Em Português, nem sempre uma letra corresponde exatamente a um som, por isso estudar fonética ajuda a perceber sílabas, pronúncia, encontros vocálicos e diferenças entre escrita e fala."
      },
      frases: {
        title: "Palavras e frases simples",
        level: "Básico",
        summary: "Veja como as palavras se combinam para formar frases com sentido.",
        content: "Uma frase é uma sequência de palavras que transmite uma ideia completa. Para começar, observe quem pratica a ação, qual ação acontece e qual informação complementa a mensagem. Essa leitura ajuda a entender melhor textos curtos e a escrever com clareza."
      },
      ortografia: {
        title: "Ortografia e acentuação",
        level: "Básico",
        summary: "Aprenda regras iniciais de escrita correta e uso de acentos.",
        content: "Ortografia é o estudo da escrita correta das palavras. A acentuação mostra a sílaba mais forte e pode diferenciar significados. Palavras como café, avó e lápis mostram como o acento ajuda na pronúncia e na compreensão."
      },
      classes: {
        title: "Classes de palavras",
        level: "Intermediário",
        summary: "Identifique substantivos, verbos, adjetivos e a função de cada termo.",
        content: "As classes de palavras indicam o papel de cada termo dentro da frase. Substantivos nomeiam seres e ideias, verbos indicam ações ou estados, e adjetivos caracterizam substantivos. Reconhecer essas classes melhora a leitura e a escrita."
      },
      concordancia: {
        title: "Concordância",
        level: "Intermediário",
        summary: "Aprenda como palavras combinam em número, pessoa e gênero.",
        content: "Concordância é a harmonia entre palavras. Na concordância nominal, artigos, adjetivos e substantivos combinam em gênero e número. Na verbal, o verbo se ajusta ao sujeito. Exemplos: os alunos estudiosos chegaram; a aluna estudiosa chegou."
      },
      interpretacao: {
        title: "Interpretação de textos",
        level: "Intermediário",
        summary: "Treine a identificação de tema, informações explícitas e ideias implícitas.",
        content: "Interpretar um texto é compreender o que ele diz, como diz e qual ideia principal transmite. Uma boa leitura identifica tema, objetivo, informações explícitas, pistas implícitas e relação entre frases e parágrafos."
      },
      redacao: {
        title: "Redação dissertativa",
        level: "Avançado",
        summary: "Organize tese, argumentos e conclusão para defender uma ideia.",
        content: "A redação dissertativa apresenta uma tese e usa argumentos para defendê-la. Uma estrutura comum tem introdução com tema e opinião, desenvolvimento com argumentos e conclusão retomando a ideia central."
      },
      figuras: {
        title: "Figuras de linguagem",
        level: "Avançado",
        summary: "Reconheça metáfora, comparação, ironia e outros recursos expressivos.",
        content: "Figuras de linguagem são recursos que tornam a comunicação mais expressiva. Metáfora, comparação, ironia e hipérbole mudam ou intensificam sentidos, deixando textos literários e argumentativos mais ricos."
      },
      literatura: {
        title: "Literatura",
        level: "Avançado",
        summary: "Observe contexto histórico, estilo e temas de obras literárias.",
        content: "Literatura estuda textos artísticos e sua relação com época, cultura e linguagem. Ao analisar uma obra, observe tema, personagens, narrador, estilo e contexto histórico."
      }
    }
  },
  matematica: {
    name: "Matemática",
    badge: "Σ",
    area: "Exatas",
    className: "page-matematica",
    exercise: "matematica-basico",
    topics: {
      adicao: { title: "Adição e subtração", level: "Básico", summary: "Use operações para juntar, comparar e retirar quantidades.", content: "A adição representa juntar quantidades. A subtração representa retirar, comparar ou descobrir a diferença entre valores. Essas operações são base para problemas do cotidiano, como compras, medidas e pontuações." },
      multiplicacao: { title: "Multiplicação e divisão", level: "Básico", summary: "Entenda grupos iguais, repartição e relações entre números.", content: "Multiplicação é uma forma rápida de somar parcelas iguais. Divisão é repartir uma quantidade em partes iguais ou descobrir quantos grupos cabem em um total. As duas operações são inversas." },
      problemas: { title: "Problemas simples", level: "Básico", summary: "Transforme situações do dia a dia em contas e resoluções.", content: "Resolver problemas exige ler com atenção, separar informações importantes, escolher uma operação e verificar se a resposta faz sentido. Muitas vezes a parte mais importante é entender o que a pergunta pede." },
      fracoes: { title: "Frações e decimais", level: "Intermediário", summary: "Compare partes de um inteiro e represente valores de formas diferentes.", content: "Frações representam partes de um todo, como 1/2 ou 3/4. Decimais mostram valores com vírgula, como 0,5. Eles podem representar a mesma quantidade de maneiras diferentes." },
      porcentagem: { title: "Porcentagens", level: "Intermediário", summary: "Calcule descontos, aumentos e proporções usando base 100.", content: "Porcentagem significa por cem. Ela é usada para calcular descontos, juros, aumentos e comparações. Por exemplo, 25% equivale a 25 partes de cada 100, ou um quarto do total." },
      equacoes: { title: "Equações do 1º grau", level: "Intermediário", summary: "Descubra valores desconhecidos mantendo o equilíbrio da igualdade.", content: "Uma equação do 1º grau possui uma incógnita elevada à primeira potência. Resolver é encontrar o valor que torna a igualdade verdadeira, mantendo equilíbrio nos dois lados." },
      segundo_grau: { title: "Equações do 2º grau", level: "Avançado", summary: "Resolva expressões com termo ao quadrado e analise suas raízes.", content: "Equações do 2º grau têm a forma ax² + bx + c = 0. Elas podem ter duas, uma ou nenhuma raiz real. São muito usadas em problemas de movimento, áreas e funções." },
      funcoes: { title: "Funções e gráficos", level: "Avançado", summary: "Relacione grandezas e interprete informações no plano cartesiano.", content: "Funções mostram como uma grandeza depende de outra. Gráficos ajudam a visualizar crescimento, queda, máximos, mínimos e padrões de relação entre variáveis." },
      desafios: { title: "Problemas desafiadores", level: "Avançado", summary: "Combine várias ideias matemáticas para resolver situações complexas.", content: "Problemas desafiadores misturam leitura, cálculo e estratégia. Uma boa abordagem é dividir o problema em partes menores, testar caminhos e conferir o resultado." }
    }
  },
  quimica: {
    name: "Química",
    badge: "Qm",
    area: "Ciências da natureza",
    className: "page-quimica",
    exercise: "quimica-basico",
    topics: {
      atomos: { title: "Átomos e moléculas", level: "Básico", summary: "Conheça as partículas que formam a matéria e como elas se agrupam.", content: "Átomos são unidades básicas dos elementos químicos. Moléculas surgem quando átomos se ligam. A água, por exemplo, é formada por dois átomos de hidrogênio e um de oxigênio." },
      estados: { title: "Estados físicos", level: "Básico", summary: "Entenda sólido, líquido e gasoso a partir da organização das partículas.", content: "Nos sólidos, as partículas ficam mais organizadas e próximas. Nos líquidos, elas se movimentam mais. Nos gases, ficam afastadas e ocupam o espaço disponível." },
      tabela: { title: "Tabela periódica", level: "Básico", summary: "Veja como os elementos químicos são organizados por propriedades.", content: "A tabela periódica organiza os elementos por número atômico e propriedades. Ela permite comparar elementos, prever comportamentos e localizar metais, ametais e gases nobres." },
      ligacoes: { title: "Ligações químicas", level: "Intermediário", summary: "Entenda como átomos se unem para formar substâncias.", content: "Ligações químicas são forças que unem átomos. Podem ser iônicas, covalentes ou metálicas, dependendo de como os elétrons participam da união." },
      balanceamento: { title: "Balanceamento", level: "Intermediário", summary: "Aprenda a manter a mesma quantidade de átomos nos dois lados da equação.", content: "Balancear uma equação química garante que a quantidade de átomos seja igual antes e depois da reação, respeitando a conservação da massa." },
      acido_base: { title: "Ácido-base", level: "Intermediário", summary: "Reconheça reações entre ácidos e bases e seus produtos comuns.", content: "Reações ácido-base envolvem substâncias com características opostas. Muitas neutralizações formam sal e água, dependendo dos reagentes." },
      estequiometria: { title: "Estequiometria", level: "Avançado", summary: "Relacione quantidades de reagentes e produtos em uma reação.", content: "Estequiometria usa proporções das equações químicas para calcular massas, mols, volumes e rendimento de reações." },
      cinetica: { title: "Cinética química", level: "Avançado", summary: "Estude os fatores que alteram a velocidade das reações.", content: "Cinética química estuda a velocidade das reações. Temperatura, concentração, superfície de contato e catalisadores podem alterar essa velocidade." },
      organica: { title: "Química orgânica", level: "Avançado", summary: "Conheça compostos de carbono e hidrocarbonetos.", content: "Química orgânica estuda compostos de carbono, presentes em combustíveis, alimentos, medicamentos, plásticos e seres vivos." }
    }
  },
  fisica: {
    name: "Física",
    badge: "Fx",
    area: "Ciências da natureza",
    className: "page-fisica",
    exercise: "fisica-basico",
    topics: {
      movimento: { title: "Movimento", level: "Básico", summary: "Estude posição, deslocamento, velocidade e aceleração.", content: "Movimento descreve como a posição de um corpo muda ao longo do tempo. Velocidade indica rapidez e direção; aceleração indica variação da velocidade." },
      newton: { title: "Leis de Newton", level: "Básico", summary: "Entenda a relação entre força, massa e movimento.", content: "As Leis de Newton explicam o comportamento dos corpos quando forças atuam. Elas tratam de inércia, relação entre força e aceleração, e ação e reação." },
      grandezas: { title: "Grandezas e unidades", level: "Básico", summary: "Reconheça medidas como metro, segundo, quilograma e newton.", content: "Grandezas físicas são propriedades que podem ser medidas. Unidades como metro, segundo e quilograma padronizam essas medidas." },
      energia: { title: "Energia", level: "Intermediário", summary: "Diferencie energia cinética, potencial e transformações.", content: "Energia cinética está ligada ao movimento. Energia potencial depende da posição ou configuração. A energia pode se transformar, mas em sistemas ideais se conserva." },
      trabalho: { title: "Trabalho e potência", level: "Intermediário", summary: "Relacione força, deslocamento e rapidez na realização de trabalho.", content: "Trabalho ocorre quando uma força provoca deslocamento. Potência mede a rapidez com que o trabalho é realizado." },
      conservacao: { title: "Conservação", level: "Intermediário", summary: "Entenda sistemas em que energia e quantidade de movimento se mantêm.", content: "Leis de conservação mostram que algumas grandezas permanecem constantes em determinadas condições, ajudando a resolver problemas físicos." },
      eletro: { title: "Eletromagnetismo", level: "Avançado", summary: "Estude campos elétricos, magnéticos e interações entre cargas.", content: "Eletromagnetismo explica fenômenos ligados a cargas elétricas, correntes, campos magnéticos e suas interações." },
      maxwell: { title: "Leis de Maxwell", level: "Avançado", summary: "Conheça ideias que conectam eletricidade, magnetismo e ondas.", content: "As equações de Maxwell resumem relações entre campos elétricos e magnéticos, mostrando como eles podem gerar ondas eletromagnéticas." },
      optica: { title: "Óptica", level: "Avançado", summary: "Analise luz, reflexão, refração e formação de imagens.", content: "Óptica estuda o comportamento da luz em espelhos, lentes e diferentes meios, explicando reflexão, refração e formação de imagens." }
    }
  },
  geografia: {
    name: "Geografia",
    badge: "Geo",
    area: "Ciências humanas",
    className: "page-geografia",
    exercise: "geografia-basico",
    topics: {
      mapas: { title: "Mapas e orientação", level: "Básico", summary: "Aprenda pontos cardeais, legendas, escalas e leitura de mapas.", content: "Mapas representam espaços reais de forma reduzida. Para interpretá-los, observe título, legenda, escala, orientação e símbolos usados. Esses elementos ajudam a localizar lugares e entender relações espaciais." },
      relevo: { title: "Relevo e paisagem", level: "Básico", summary: "Conheça montanhas, planaltos, planícies, depressões e paisagens naturais.", content: "Relevo é o conjunto de formas da superfície terrestre. Ele influencia rios, clima, ocupação humana, agricultura e circulação de pessoas." },
      clima: { title: "Tempo e clima", level: "Básico", summary: "Diferencie fenômenos momentâneos de padrões atmosféricos de longo prazo.", content: "Tempo é a condição atmosférica de um momento, como chuva ou sol hoje. Clima é o padrão observado por longos períodos em uma região." },
      populacao: { title: "População e urbanização", level: "Intermediário", summary: "Entenda crescimento populacional, migração e formação das cidades.", content: "A população muda com nascimentos, mortes e migrações. Urbanização é o crescimento das cidades e transforma moradia, trabalho, transporte e meio ambiente." },
      economia: { title: "Setores econômicos", level: "Intermediário", summary: "Estude atividades primárias, secundárias e terciárias.", content: "A economia pode ser analisada por setores: o primário extrai recursos, o secundário transforma matérias-primas e o terciário oferece comércio e serviços." },
      biomas: { title: "Biomas brasileiros", level: "Intermediário", summary: "Conheça Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.", content: "Biomas são grandes conjuntos de vida vegetal e animal adaptados a determinadas condições de clima, solo e relevo." },
      globalizacao: { title: "Globalização", level: "Avançado", summary: "Analise fluxos de mercadorias, informação, cultura e tecnologia.", content: "Globalização é a intensificação das conexões entre lugares por comércio, tecnologia, transporte, comunicação e circulação de capitais." },
      geopolitica: { title: "Geopolítica", level: "Avançado", summary: "Entenda poder, território, conflitos e relações internacionais.", content: "Geopolítica estuda como países e grupos disputam poder, recursos, influência e controle sobre territórios estratégicos." },
      sustentabilidade: { title: "Sustentabilidade", level: "Avançado", summary: "Discuta desenvolvimento, preservação ambiental e uso consciente dos recursos.", content: "Sustentabilidade busca equilibrar necessidades sociais, crescimento econômico e proteção ambiental para garantir qualidade de vida no presente e no futuro." }
    }
  },
  historia: {
    name: "História",
    badge: "His",
    area: "Ciências humanas",
    className: "page-historia",
    exercise: "historia-basico",
    topics: {
      tempo: { title: "Tempo histórico", level: "Básico", summary: "Entenda cronologia, fontes históricas e formas de medir o tempo.", content: "Tempo histórico organiza acontecimentos e mudanças das sociedades. Ele usa datas, períodos, fontes e interpretações para compreender processos humanos." },
      fontes: { title: "Fontes históricas", level: "Básico", summary: "Conheça documentos, imagens, objetos, relatos e vestígios do passado.", content: "Fontes históricas são materiais usados para estudar o passado. Elas podem ser escritas, visuais, orais, materiais ou digitais." },
      antigas: { title: "Civilizações antigas", level: "Básico", summary: "Estude Egito, Mesopotâmia, Grécia, Roma e outras sociedades antigas.", content: "Civilizações antigas desenvolveram formas de governo, religião, escrita, economia, arquitetura e cultura que influenciaram muitos povos posteriores." },
      idade_media: { title: "Idade Média", level: "Intermediário", summary: "Entenda feudalismo, Igreja, cidades medievais e relações de poder.", content: "A Idade Média teve forte presença da Igreja, economia agrária, relações de dependência e mudanças graduais que abriram caminho para novas formas de organização social." },
      colonizacao: { title: "Colonização do Brasil", level: "Intermediário", summary: "Analise exploração, povos indígenas, escravidão e economia colonial.", content: "A colonização portuguesa no Brasil envolveu ocupação territorial, exploração econômica, violência contra povos indígenas e escravização de africanos." },
      revolucoes: { title: "Revoluções modernas", level: "Intermediário", summary: "Estude Revolução Industrial, Francesa e transformações políticas e econômicas.", content: "Revoluções modernas mudaram formas de trabalho, produção, governo e participação política, influenciando sociedades contemporâneas." },
      imperialismo: { title: "Imperialismo", level: "Avançado", summary: "Entenda expansão europeia, dominação econômica e disputas territoriais.", content: "Imperialismo foi a expansão de potências sobre outros territórios para controlar recursos, mercados e influência política." },
      guerras: { title: "Guerras mundiais", level: "Avançado", summary: "Analise causas, consequências e transformações do século XX.", content: "As guerras mundiais envolveram disputas políticas, econômicas e territoriais, causando destruição, mudanças de fronteiras e novas relações internacionais." },
      brasil_republica: { title: "Brasil República", level: "Avançado", summary: "Estude cidadania, governos, democracia, ditadura e redemocratização.", content: "A história republicana do Brasil envolve disputas políticas, transformações sociais, períodos democráticos, autoritarismo e lutas por direitos." }
    }
  },
  biologia: {
    name: "Biologia",
    badge: "Bio",
    area: "Ciências da natureza",
    className: "page-biologia",
    exercise: "biologia-basico",
    topics: {
      celula: { title: "Célula", level: "Básico", summary: "Conheça a unidade básica dos seres vivos.", content: "A célula é a menor unidade viva. Ela possui estruturas que realizam funções essenciais, como obter energia, produzir substâncias e controlar atividades." },
      seres_vivos: { title: "Seres vivos", level: "Básico", summary: "Entenda características como organização, metabolismo, reprodução e evolução.", content: "Seres vivos são organizados, usam energia, respondem ao ambiente, reproduzem-se e passam por mudanças ao longo das gerações." },
      ecossistemas: { title: "Ecossistemas", level: "Básico", summary: "Aprenda relações entre seres vivos e ambiente.", content: "Ecossistema é o conjunto formado por seres vivos e fatores físicos, como água, luz, temperatura e solo, interagindo em um ambiente." },
      genetica: { title: "Genética", level: "Intermediário", summary: "Estude DNA, genes, hereditariedade e características hereditárias.", content: "Genética explica como características são transmitidas entre gerações por meio de genes presentes no DNA." },
      evolucao: { title: "Evolução", level: "Intermediário", summary: "Entenda seleção natural, adaptação e ancestralidade comum.", content: "Evolução é o processo de mudança das populações ao longo do tempo, influenciado por variação, hereditariedade e seleção natural." },
      fisiologia: { title: "Fisiologia humana", level: "Intermediário", summary: "Conheça sistemas do corpo e suas funções.", content: "Fisiologia estuda o funcionamento do organismo, incluindo sistemas digestório, respiratório, circulatório, nervoso e outros." },
      biotecnologia: { title: "Biotecnologia", level: "Avançado", summary: "Analise aplicações de organismos e moléculas em tecnologia.", content: "Biotecnologia usa seres vivos, células ou moléculas biológicas para produzir medicamentos, alimentos, diagnósticos e soluções ambientais." },
      imunologia: { title: "Imunologia", level: "Avançado", summary: "Entenda defesa do corpo, vacinas e resposta imune.", content: "Imunologia estuda como o organismo reconhece e combate agentes invasores por barreiras, células de defesa e anticorpos." },
      ecologia_avancada: { title: "Ecologia avançada", level: "Avançado", summary: "Estude cadeias alimentares, ciclos biogeoquímicos e impactos ambientais.", content: "Ecologia avançada analisa fluxos de energia, ciclos da matéria, relações ecológicas e efeitos das atividades humanas sobre os ambientes." }
    }
  },
  ingles: {
    name: "Inglês",
    badge: "En",
    area: "Linguagens",
    className: "page-ingles",
    exercise: "ingles-basico",
    topics: {
      greetings: { title: "Greetings", level: "Básico", summary: "Aprenda cumprimentos e apresentações simples.", content: "Greetings são expressões usadas para cumprimentar, iniciar conversas e se apresentar, como hello, good morning e nice to meet you." },
      vocabulary: { title: "Basic vocabulary", level: "Básico", summary: "Construa vocabulário inicial de objetos, cores, números e rotina.", content: "Vocabulário básico ajuda a reconhecer palavras frequentes e formar frases simples sobre pessoas, objetos e ações do dia a dia." },
      simple_present: { title: "Simple present", level: "Básico", summary: "Use verbos para falar de hábitos e rotinas.", content: "Simple present é usado para hábitos, fatos e rotinas. Em frases com he, she e it, muitos verbos recebem s no final." },
      reading: { title: "Reading strategies", level: "Intermediário", summary: "Use contexto, cognatos e palavras-chave para interpretar textos.", content: "Estratégias de leitura ajudam a entender textos mesmo sem conhecer todas as palavras. Cognatos, título, imagens e palavras-chave orientam a compreensão." },
      past: { title: "Simple past", level: "Intermediário", summary: "Fale de ações concluídas no passado.", content: "Simple past indica ações finalizadas. Verbos regulares geralmente recebem ed; verbos irregulares possuem formas próprias, como go e went." },
      modal_verbs: { title: "Modal verbs", level: "Intermediário", summary: "Aprenda can, should, must e outras ideias de possibilidade e obrigação.", content: "Modal verbs modificam o sentido do verbo principal, indicando habilidade, conselho, obrigação, permissão ou possibilidade." },
      present_perfect: { title: "Present perfect", level: "Avançado", summary: "Relacione experiências passadas com efeito no presente.", content: "Present perfect conecta passado e presente. Usa have ou has com particípio, como I have studied." },
      conditionals: { title: "Conditionals", level: "Avançado", summary: "Construa frases com condições reais, possíveis ou hipotéticas.", content: "Conditionals expressam relações de condição e resultado, como If it rains, I will stay home." },
      writing: { title: "Writing practice", level: "Avançado", summary: "Organize ideias em parágrafos e textos curtos em inglês.", content: "Writing practice desenvolve clareza, vocabulário, gramática e coesão. Um bom parágrafo tem ideia principal, desenvolvimento e fechamento." }
    }
  }
};

const LEVEL_LABELS = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado"
};

const GUIDE_EXTRAS = {
  portugues: {
    alfabeto: ["Exemplo: a palavra casa pode ser separada em ca-sa. Esse treino ajuda a reconhecer sons, sílabas e pronúncia.", ["Leia palavras em voz alta.", "Separe as sílabas.", "Compare letras que podem ter sons diferentes."]],
    frases: ["Exemplo: em O aluno estudou, aluno indica quem pratica a ação e estudou indica o que aconteceu.", ["Procure quem aparece na frase.", "Identifique a ação.", "Reescreva a frase com outras palavras."]],
    ortografia: ["Exemplo: café recebe acento porque a sílaba mais forte está no final e a palavra termina em e.", ["Observe a sílaba mais forte.", "Compare palavras com e sem acento.", "Monte uma lista de palavras difíceis."]],
    classes: ["Exemplo: em A casa antiga caiu, casa é substantivo, antiga é adjetivo e caiu é verbo.", ["Sublinhe os verbos.", "Circule os substantivos.", "Veja quais palavras caracterizam os substantivos."]],
    concordancia: ["Exemplo: o aluno estudou está no singular; os alunos estudaram está no plural.", ["Encontre o sujeito.", "Veja se está no singular ou plural.", "Confira se o verbo combina com ele."]],
    interpretacao: ["Exemplo: se um personagem sai com guarda-chuva porque o céu escureceu, podemos inferir que havia chance de chuva.", ["Leia uma vez para entender o assunto.", "Marque palavras importantes.", "Explique a ideia principal com suas palavras."]],
    redacao: ["Exemplo: tema leitura na escola; tese: a leitura deve ser incentivada porque melhora vocabulário e interpretação.", ["Defina sua tese.", "Escolha dois argumentos.", "Conclua retomando a ideia principal."]],
    figuras: ["Exemplo: meu coração é um deserto usa metáfora para expressar solidão, não um deserto literal.", ["Veja se o sentido é literal.", "Procure comparações e exageros.", "Explique o efeito da expressão."]],
    literatura: ["Exemplo: conhecer o contexto de uma obra ajuda a entender escolhas de linguagem, temas e conflitos.", ["Identifique o gênero.", "Observe a época.", "Relacione tema, forma e contexto."]]
  },
  matematica: {
    adicao: ["Exemplo: se você tinha 8 pontos e ganhou 5, calcula 8 + 5 = 13.", ["Descubra se a situação junta ou retira.", "Monte a conta.", "Confira se o resultado faz sentido."]],
    multiplicacao: ["Exemplo: 4 grupos com 3 objetos resultam em 4 x 3 = 12.", ["Procure grupos iguais.", "Transforme soma repetida em multiplicação.", "Use divisão para repartir."]],
    problemas: ["Exemplo: tinha 15 reais e gastou 6; a pergunta é quanto sobrou, então 15 - 6 = 9.", ["Leia a pergunta final.", "Marque os dados importantes.", "Escolha a operação correta."]],
    fracoes: ["Exemplo: 1/2 representa metade de um inteiro; em decimal, pode ser escrito como 0,5.", ["Desenhe o inteiro.", "Compare numerador e denominador.", "Converta frações simples em decimais."]],
    porcentagem: ["Exemplo: 25% de 100 é 25; em desconto, o valor reduzido seria 25 reais.", ["Transforme a porcentagem em fração sobre 100.", "Multiplique pelo total.", "Interprete o resultado."]],
    equacoes: ["Exemplo: em x + 5 = 12, tiramos 5 dos dois lados e encontramos x = 7.", ["Isole a incógnita.", "Faça a mesma operação dos dois lados.", "Substitua para conferir."]],
    segundo_grau: ["Exemplo: em x² - 9 = 0, temos x² = 9, então x pode ser 3 ou -3.", ["Identifique os termos.", "Tente fatorar.", "Confira as raízes na equação."]],
    funcoes: ["Exemplo: na função f(x) = 2x, se x = 4, então f(4) = 8.", ["Substitua o valor de x.", "Calcule a saída.", "Observe o comportamento no gráfico."]],
    desafios: ["Exemplo: um desafio pode misturar porcentagem e equação; resolva uma etapa por vez.", ["Divida em partes menores.", "Resolva cada etapa.", "Revise a pergunta final."]]
  },
  quimica: {
    atomos: ["Exemplo: a água é H2O, formada por dois átomos de hidrogênio e um de oxigênio.", ["Diferencie átomo e molécula.", "Observe símbolos químicos.", "Monte exemplos simples."]],
    estados: ["Exemplo: gelo, água líquida e vapor são a mesma substância em estados diferentes.", ["Compare forma e volume.", "Observe exemplos do cotidiano.", "Relacione temperatura e mudança de estado."]],
    tabela: ["Exemplo: sódio e potássio ficam no mesmo grupo e possuem propriedades semelhantes.", ["Localize grupos e períodos.", "Observe metais e ametais.", "Leia símbolo e número atômico."]],
    ligacoes: ["Exemplo: em ligações covalentes, os átomos compartilham elétrons.", ["Veja os elementos envolvidos.", "Observe se há transferência ou compartilhamento.", "Relacione isso ao tipo de substância."]],
    balanceamento: ["Exemplo: em uma equação, ajustar coeficientes iguala a quantidade de átomos dos dois lados.", ["Conte os átomos.", "Ajuste coeficientes.", "Confira a contagem final."]],
    acido_base: ["Exemplo: uma neutralização comum forma sal e água.", ["Identifique ácido e base.", "Observe os produtos.", "Relacione com a ideia de pH."]],
    estequiometria: ["Exemplo: uma proporção 2:1 na equação indica que duas partes reagem com uma parte.", ["Balanceie a equação.", "Leia as proporções.", "Use regra de três quando necessário."]],
    cinetica: ["Exemplo: um comprimido triturado reage mais rápido porque aumenta a superfície de contato.", ["Identifique o fator alterado.", "Pense nas colisões entre partículas.", "Compare reações lentas e rápidas."]],
    organica: ["Exemplo: metano, etanol e glicose são compostos orgânicos por terem carbono.", ["Procure carbono na fórmula.", "Identifique cadeias simples.", "Relacione com combustíveis e alimentos."]]
  },
  fisica: {
    movimento: ["Exemplo: se um carro percorre 100 km em 2 horas, sua velocidade média é 50 km/h.", ["Identifique distância e tempo.", "Calcule velocidade média.", "Observe se há aceleração."]],
    newton: ["Exemplo: um carrinho vazio acelera mais que um carrinho cheio quando recebe a mesma força.", ["Identifique as forças.", "Observe massa e aceleração.", "Procure ação e reação."]],
    grandezas: ["Exemplo: comprimento é medido em metro, tempo em segundo e massa em quilograma.", ["Identifique a grandeza.", "Associe a unidade correta.", "Confira se as unidades combinam."]],
    energia: ["Exemplo: uma bola no alto tem energia potencial; ao cair, ganha energia cinética.", ["Veja se há movimento.", "Observe altura ou posição.", "Identifique transformações de energia."]],
    trabalho: ["Exemplo: levantar uma caixa realiza trabalho; fazer isso mais rápido exige maior potência.", ["Veja se há força.", "Confira se há deslocamento.", "Compare o tempo gasto."]],
    conservacao: ["Exemplo: em uma montanha-russa ideal, energia potencial vira energia cinética na descida.", ["Defina o sistema.", "Identifique as energias.", "Compare antes e depois."]],
    eletro: ["Exemplo: uma corrente elétrica em um fio pode gerar campo magnético ao redor dele.", ["Identifique cargas ou correntes.", "Observe campos.", "Relacione com motores e ímãs."]],
    maxwell: ["Exemplo: a luz pode ser entendida como uma onda eletromagnética.", ["Revise campos elétricos.", "Revise campos magnéticos.", "Relacione campos variáveis e ondas."]],
    optica: ["Exemplo: um lápis na água parece torto por causa da refração da luz.", ["Diferencie reflexão e refração.", "Observe espelhos e lentes.", "Desenhe o caminho da luz."]]
  }
};

const QUIZZES = {
  portugues: {
    basico: [
      { title: "Exercício 1: Classificação de palavras", question: 'A palavra "café" é classificada como:', correct: "Oxítona", answers: ["Oxítona", "Paroxítona", "Proparoxítona", "Monossílaba átona"] },
      { title: "Exercício 2: Classes gramaticais", question: 'Na frase "O aluno estudou", a palavra "aluno" é um:', correct: "Substantivo", answers: ["Verbo", "Adjetivo", "Substantivo", "Advérbio"] },
      { title: "Exercício 3: Ortografia", question: "O uso correto do acento nas palavras faz parte principalmente da:", correct: "Acentuação", answers: ["Pontuação", "Acentuação", "Concordância", "Coesão"] }
    ],
    intermediario: [
      { title: "Exercício 1: Classes de palavras", question: 'Na frase "A menina correu rápido", qual palavra é um verbo?', correct: "correu", answers: ["menina", "correu", "rápido", "A"] },
      { title: "Exercício 2: Concordância", question: "Qual frase apresenta concordância correta?", correct: "Os alunos estudaram bastante.", answers: ["Os aluno estudaram bastante.", "Os alunos estudou bastante.", "Os alunos estudaram bastante.", "O alunos estudaram bastante."] },
      { title: "Exercício 3: Interpretação", question: "Em um texto, a ideia principal também pode ser chamada de:", correct: "Tema", answers: ["Tema", "Letra", "Rima", "Pontuação"] }
    ],
    avancado: [
      { title: "Exercício 1: Redação", question: "Em uma redação dissertativa, a tese representa:", correct: "A opinião principal defendida", answers: ["A opinião principal defendida", "A lista de referências", "A assinatura do autor", "O título obrigatório"] },
      { title: "Exercício 2: Figuras de linguagem", question: 'Em "meu coração é um deserto", há principalmente:', correct: "Metáfora", answers: ["Metáfora", "Enumeração", "Pleonasmo", "Onomatopeia"] },
      { title: "Exercício 3: Literatura", question: "Ao analisar uma obra literária, o contexto histórico ajuda a entender:", correct: "A época e as ideias presentes no texto", answers: ["Somente a capa", "A época e as ideias presentes no texto", "A quantidade de páginas", "A fonte usada"] }
    ]
  },
  matematica: {
    basico: [
      { title: "Exercício 1: Qual é o resultado da operação?", question: "Quanto é 8 + 5?", correct: "13", answers: ["13", "12", "14", "15"] },
      { title: "Exercício 2: Qual é o resultado da operação?", question: "Quanto é 10 - 3?", correct: "7", answers: ["7", "6", "8", "5"] },
      { title: "Exercício 3: Qual é o resultado da operação?", question: "Quanto é 4 + 6?", correct: "10", answers: ["10", "9", "11", "8"] }
    ],
    intermediario: [
      { title: "Exercício 1: Frações", question: "Qual fração representa metade de um inteiro?", correct: "1/2", answers: ["1/4", "1/2", "2/3", "3/4"] },
      { title: "Exercício 2: Porcentagem", question: "25% de 100 é igual a:", correct: "25", answers: ["10", "20", "25", "50"] },
      { title: "Exercício 3: Equação do 1º grau", question: "Se x + 5 = 12, então x vale:", correct: "7", answers: ["5", "6", "7", "12"] }
    ],
    avancado: [
      { title: "Exercício 1: Equação do 2º grau", question: "Na equação x² - 9 = 0, as raízes são:", correct: "3 e -3", answers: ["9 e -9", "3 e -3", "0 e 9", "1 e -9"] },
      { title: "Exercício 2: Funções", question: "Em f(x) = 2x, o valor de f(4) é:", correct: "8", answers: ["2", "4", "6", "8"] },
      { title: "Exercício 3: Problemas", question: "Resolver um problema complexo geralmente começa por:", correct: "Ler e separar as informações importantes", answers: ["Chutar a resposta", "Ignorar os dados", "Ler e separar as informações importantes", "Copiar a pergunta"] }
    ]
  },
  quimica: {
    basico: [
      { title: "Exercício 1: Estrutura da matéria", question: "Qual é a menor unidade básica de um elemento químico?", correct: "Átomo", answers: ["Molécula", "Átomo", "Mistura", "Solução"] },
      { title: "Exercício 2: Estados físicos", question: "Qual estado físico tem volume definido, mas forma variável?", correct: "Líquido", answers: ["Sólido", "Líquido", "Gasoso", "Plasma"] },
      { title: "Exercício 3: Elementos químicos", question: "Onde os elementos químicos são organizados?", correct: "Tabela periódica", answers: ["Mapa molecular", "Tabela periódica", "Escala Celsius", "Plano cartesiano"] }
    ],
    intermediario: [
      { title: "Exercício 1: Ligações químicas", question: "A ligação em que há compartilhamento de elétrons é chamada de:", correct: "Covalente", answers: ["Iônica", "Covalente", "Metálica", "Nuclear"] },
      { title: "Exercício 2: Balanceamento", question: "Balancear uma equação química respeita principalmente a conservação da:", correct: "Massa", answers: ["Cor", "Massa", "Temperatura", "Velocidade"] },
      { title: "Exercício 3: Ácido-base", question: "Uma neutralização ácido-base costuma formar:", correct: "Sal e água", answers: ["Sal e água", "Areia e óleo", "Metal e luz", "Gás nobre"] }
    ],
    avancado: [
      { title: "Exercício 1: Estequiometria", question: "A estequiometria usa as proporções da equação para calcular:", correct: "Quantidades de reagentes e produtos", answers: ["A cor da solução", "Quantidades de reagentes e produtos", "A altura do recipiente", "A massa da tabela"] },
      { title: "Exercício 2: Cinética química", question: "Qual fator pode aumentar a velocidade de uma reação?", correct: "Aumento da temperatura", answers: ["Aumento da temperatura", "Remover todos os reagentes", "Diminuir a superfície de contato", "Apagar a equação"] },
      { title: "Exercício 3: Química orgânica", question: "A química orgânica estuda principalmente compostos de:", correct: "Carbono", answers: ["Carbono", "Hélio", "Neônio", "Argônio"] }
    ]
  },
  fisica: {
    basico: [
      { title: "Exercício 1: Grandezas físicas", question: "Qual grandeza relaciona distância percorrida e tempo gasto?", correct: "Velocidade", answers: ["Massa", "Velocidade", "Temperatura", "Volume"] },
      { title: "Exercício 2: Leis de Newton", question: "Na Física, a interação capaz de alterar o movimento de um corpo é chamada de:", correct: "Força", answers: ["Força", "Calor", "Densidade", "Pressão atmosférica"] },
      { title: "Exercício 3: Unidades de medida", question: "Qual é a unidade básica de comprimento no Sistema Internacional?", correct: "Metro", answers: ["Quilograma", "Segundo", "Metro", "Newton"] }
    ],
    intermediario: [
      { title: "Exercício 1: Energia", question: "A energia associada ao movimento de um corpo é chamada de:", correct: "Energia cinética", answers: ["Energia cinética", "Energia sonora", "Energia química", "Energia térmica"] },
      { title: "Exercício 2: Trabalho", question: "Na Física, trabalho ocorre quando uma força provoca:", correct: "Deslocamento", answers: ["Silêncio", "Deslocamento", "Congelamento", "Escuridão"] },
      { title: "Exercício 3: Conservação", question: "Em um sistema ideal, a energia total tende a:", correct: "Se conservar", answers: ["Desaparecer", "Se conservar", "Virar massa sempre", "Ficar negativa sempre"] }
    ],
    avancado: [
      { title: "Exercício 1: Eletromagnetismo", question: "Cargas elétricas em movimento estão relacionadas à formação de:", correct: "Campos magnéticos", answers: ["Campos magnéticos", "Somente sombras", "Apenas massa", "Volume fixo"] },
      { title: "Exercício 2: Maxwell", question: "As equações de Maxwell conectam eletricidade, magnetismo e:", correct: "Ondas eletromagnéticas", answers: ["Ondas eletromagnéticas", "Frações", "Acentos", "Ligações covalentes"] },
      { title: "Exercício 3: Óptica", question: "A mudança de direção da luz ao passar de um meio para outro é chamada de:", correct: "Refração", answers: ["Refração", "Evaporação", "Condensação", "Atrito"] }
    ]
  },
  geografia: {
    basico: [
      { title: "Exercício 1: Mapas", question: "Qual elemento explica o significado dos símbolos em um mapa?", correct: "Legenda", answers: ["Legenda", "Título", "Clima", "Fronteira"] },
      { title: "Exercício 2: Relevo", question: "Planícies são áreas geralmente:", correct: "Mais baixas e pouco inclinadas", answers: ["Muito inclinadas", "Mais baixas e pouco inclinadas", "Sempre cobertas por gelo", "Sem rios"] },
      { title: "Exercício 3: Tempo e clima", question: "A condição atmosférica observada em um dia específico é chamada de:", correct: "Tempo", answers: ["Tempo", "Clima", "Bioma", "Relevo"] }
    ],
    intermediario: [
      { title: "Exercício 1: Urbanização", question: "Urbanização está relacionada ao crescimento das:", correct: "Cidades", answers: ["Florestas", "Cidades", "Montanhas", "Geleiras"] },
      { title: "Exercício 2: Economia", question: "A indústria pertence principalmente ao setor:", correct: "Secundário", answers: ["Primário", "Secundário", "Terciário", "Informal"] },
      { title: "Exercício 3: Biomas", question: "Qual bioma brasileiro é conhecido pela grande biodiversidade e floresta densa?", correct: "Amazônia", answers: ["Pampa", "Caatinga", "Amazônia", "Pantanal"] }
    ],
    avancado: [
      { title: "Exercício 1: Globalização", question: "A globalização intensifica principalmente:", correct: "Conexões entre lugares", answers: ["Isolamento total", "Conexões entre lugares", "Fim dos transportes", "Ausência de comércio"] },
      { title: "Exercício 2: Geopolítica", question: "Geopolítica estuda relações entre poder e:", correct: "Território", answers: ["Pontuação", "Território", "Acentuação", "Fotossíntese"] },
      { title: "Exercício 3: Sustentabilidade", question: "Sustentabilidade busca equilibrar ambiente, economia e:", correct: "Sociedade", answers: ["Sociedade", "Apenas lucro", "Somente clima", "Somente indústria"] }
    ]
  },
  historia: {
    basico: [
      { title: "Exercício 1: Tempo histórico", question: "A cronologia ajuda a organizar acontecimentos em ordem de:", correct: "Tempo", answers: ["Cor", "Tempo", "Tamanho", "Distância"] },
      { title: "Exercício 2: Fontes históricas", question: "Cartas, fotos e objetos antigos podem ser:", correct: "Fontes históricas", answers: ["Mapas climáticos", "Fontes históricas", "Equações", "Biomas"] },
      { title: "Exercício 3: Civilizações antigas", question: "Egito, Grécia e Roma são exemplos de civilizações:", correct: "Antigas", answers: ["Industriais", "Antigas", "Digitais", "Contemporâneas apenas"] }
    ],
    intermediario: [
      { title: "Exercício 1: Idade Média", question: "O feudalismo esteve ligado principalmente à economia:", correct: "Agrária", answers: ["Agrária", "Digital", "Espacial", "Petrolífera moderna"] },
      { title: "Exercício 2: Colonização", question: "A colonização do Brasil foi marcada pela exploração e pela:", correct: "Escravidão", answers: ["Escravidão", "Internet", "Democracia plena", "Indústria automobilística"] },
      { title: "Exercício 3: Revoluções", question: "A Revolução Industrial transformou principalmente o modo de:", correct: "Produzir", answers: ["Dormir", "Produzir", "Respirar", "Escrever acentos"] }
    ],
    avancado: [
      { title: "Exercício 1: Imperialismo", question: "Imperialismo envolve expansão e domínio sobre:", correct: "Territórios e mercados", answers: ["Sílabas", "Territórios e mercados", "Células", "Frações"] },
      { title: "Exercício 2: Guerras mundiais", question: "As guerras mundiais marcaram intensamente o século:", correct: "XX", answers: ["X", "XV", "XX", "V"] },
      { title: "Exercício 3: Brasil República", question: "A redemocratização brasileira está ligada à retomada de:", correct: "Direitos políticos", answers: ["Direitos políticos", "Feudalismo", "Império romano", "Escambo colonial"] }
    ]
  },
  biologia: {
    basico: [
      { title: "Exercício 1: Célula", question: "A célula é considerada a unidade básica dos:", correct: "Seres vivos", answers: ["Seres vivos", "Mapas", "Planetas", "Números"] },
      { title: "Exercício 2: Seres vivos", question: "Uma característica dos seres vivos é:", correct: "Metabolismo", answers: ["Metabolismo", "Legenda", "Fronteira", "Equação"] },
      { title: "Exercício 3: Ecossistemas", question: "Ecossistema inclui seres vivos e fatores:", correct: "Físicos do ambiente", answers: ["Físicos do ambiente", "Apenas cidades", "Somente livros", "Apenas máquinas"] }
    ],
    intermediario: [
      { title: "Exercício 1: Genética", question: "Genes estão associados à transmissão de:", correct: "Características hereditárias", answers: ["Características hereditárias", "Mapas", "Dinheiro", "Relevo"] },
      { title: "Exercício 2: Evolução", question: "A seleção natural atua sobre variações em:", correct: "Populações", answers: ["Populações", "Pontuações", "Fórmulas", "Fronteiras"] },
      { title: "Exercício 3: Fisiologia", question: "Fisiologia humana estuda o funcionamento dos:", correct: "Sistemas do corpo", answers: ["Sistemas do corpo", "Países", "Mapas", "Verbos"] }
    ],
    avancado: [
      { title: "Exercício 1: Biotecnologia", question: "Biotecnologia usa organismos ou moléculas biológicas para criar:", correct: "Produtos e soluções", answers: ["Produtos e soluções", "Relevos", "Impérios", "Acentos"] },
      { title: "Exercício 2: Imunologia", question: "Vacinas ajudam o corpo a desenvolver:", correct: "Resposta imune", answers: ["Resposta imune", "Erosão", "Urbanização", "Concordância"] },
      { title: "Exercício 3: Ecologia avançada", question: "Cadeias alimentares representam fluxo de:", correct: "Energia", answers: ["Energia", "Pontuação", "Território", "Gramática"] }
    ]
  },
  ingles: {
    basico: [
      { title: "Exercise 1: Greetings", question: "Qual expressão significa 'bom dia' em inglês?", correct: "Good morning", answers: ["Good morning", "Good night", "Thank you", "See you"] },
      { title: "Exercise 2: Vocabulary", question: "A palavra 'blue' indica uma:", correct: "Cor", answers: ["Cor", "Comida", "Cidade", "Profissão"] },
      { title: "Exercise 3: Simple present", question: "Com he/she/it, muitos verbos no simple present recebem:", correct: "s", answers: ["s", "ed", "ing", "will"] }
    ],
    intermediario: [
      { title: "Exercise 1: Reading", question: "Cognatos ajudam na leitura porque são palavras:", correct: "Parecidas em duas línguas", answers: ["Parecidas em duas línguas", "Sempre falsas", "Sem significado", "Apenas verbos"] },
      { title: "Exercise 2: Simple past", question: "O passado de go é:", correct: "went", answers: ["goed", "goes", "went", "going"] },
      { title: "Exercise 3: Modal verbs", question: "O modal should geralmente indica:", correct: "Conselho", answers: ["Conselho", "Passado obrigatório", "Plural", "Cor"] }
    ],
    avancado: [
      { title: "Exercise 1: Present perfect", question: "Present perfect usa have/has +:", correct: "Particípio", answers: ["Particípio", "Infinitivo sempre", "Artigo", "Adjetivo apenas"] },
      { title: "Exercise 2: Conditionals", question: "Em If it rains, I will stay home, a frase expressa:", correct: "Condição e resultado", answers: ["Condição e resultado", "Somente passado", "Comparação", "Ordem alfabética"] },
      { title: "Exercise 3: Writing", question: "Um bom parágrafo costuma ter uma ideia principal e:", correct: "Desenvolvimento", answers: ["Desenvolvimento", "Somente título", "Apenas números", "Nenhum fechamento"] }
    ]
  }
};

function getSubjectAndTopic() {
  const params = new URLSearchParams(window.location.search);
  const subjectKey = params.get("materia") || "portugues";
  const topicKey = params.get("topico");

  return {
    subjectKey,
    topicKey,
    subject: SUBJECTS[subjectKey],
    topic: SUBJECTS[subjectKey]?.topics[topicKey]
  };
}

function renderContentPage() {
  const page = document.getElementById("content-page");

  if (!page) {
    return;
  }

  const { subjectKey, topicKey, subject, topic } = getSubjectAndTopic();

  if (!subject || !topic) {
    page.innerHTML = `
      <section class="content-page-card">
        <h1>Conteúdo não encontrado</h1>
        <p>Volte para a lista de disciplinas e escolha um tópico disponível.</p>
        <a class="topic-button study" href="../disciplinas.html">Ver disciplinas</a>
      </section>
    `;
    return;
  }

  document.title = `${topic.title} | ${subject.name}`;
  document.body.classList.add(subject.className);
  const extra = GUIDE_EXTRAS[subjectKey]?.[topicKey];
  const example = extra?.[0] || `Exemplo: observe como ${topic.title.toLowerCase()} aparece em situações simples e tente explicar o conceito com suas próprias palavras.`;
  const steps = extra?.[1] || ["Leia a explicação com calma.", "Anote as palavras principais.", "Resolva os exercícios para conferir se entendeu."];

  page.innerHTML = `
    <section class="content-page-card">
      <span class="subject-icon">${subject.badge}</span>
      <span class="content-level">${subject.area} • ${topic.level}</span>
      <h1>${topic.title}</h1>
      <p class="content-summary">${topic.summary}</p>
      <div class="study-guide">
        <section class="content-body">
          <h2>Entenda o conceito</h2>
          <p>${topic.content}</p>
          <p>Antes de decorar, procure entender para que esse conteúdo serve. Quando você reconhece o conceito em exemplos simples, fica mais fácil aplicar em exercícios e textos maiores.</p>
        </section>
        <section class="content-body">
          <h2>Exemplo prático</h2>
          <p>${example}</p>
        </section>
        <section class="content-body">
          <h2>Como estudar este tópico</h2>
          <ul>
            ${steps.map((step) => `<li>${step}</li>`).join("")}
          </ul>
        </section>
      </div>
      <div class="content-actions">
        <a class="topic-button exercise" href="exercicios.html?materia=${subjectKey}&nivel=${getLevelKey(topic.level)}">Fazer exercícios</a>
        <a class="topic-button study" href="${subjectKey}.html">Voltar para ${subject.name}</a>
      </div>
    </section>
  `;
}

function getLevelKey(levelLabel) {
  return Object.entries(LEVEL_LABELS).find(([, label]) => label === levelLabel)?.[0] || "basico";
}

function renderExercisePage() {
  const page = document.getElementById("exercise-page");

  if (!page) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const subjectKey = params.get("materia") || "portugues";
  const levelKey = params.get("nivel") || "basico";
  const subject = SUBJECTS[subjectKey];
  const questions = QUIZZES[subjectKey]?.[levelKey];
  const levelLabel = LEVEL_LABELS[levelKey] || "Básico";
  const quizId = `${subjectKey}-${levelKey}`;

  if (!subject || !questions) {
    page.innerHTML = `
      <section class="content-page-card">
        <h1>Exercícios não encontrados</h1>
        <p>Volte para a lista de disciplinas e escolha uma matéria disponível.</p>
        <a class="topic-button study" href="../disciplinas.html">Ver disciplinas</a>
      </section>
    `;
    return;
  }

  document.title = `Exercícios ${levelLabel} | ${subject.name}`;
  document.body.classList.add(subject.className);

  page.innerHTML = `
    <section class="content-page-card">
      <span class="subject-icon">${subject.badge}</span>
      <span class="content-level">${subject.area} • Quiz ${levelLabel}</span>
      <h1>Exercícios ${levelLabel} de ${subject.name}</h1>
      <p class="content-summary">Responda às questões para ganhar XP, avançar no progresso e desbloquear a conquista da matéria.</p>
    </section>

    <section class="gamification-panel" data-quiz-id="${quizId}" data-total-questions="${questions.length}" data-level-label="${levelLabel}">
      <div class="game-card">
        <span class="game-label">Progresso do quiz ${levelLabel}</span>
        <strong class="game-value" data-progress>0/${questions.length}</strong>
        <span class="progress-track"><span class="progress-fill"></span></span>
      </div>
      <div class="game-card">
        <span class="game-label">XP total</span>
        <strong class="game-value"><span data-xp>0</span> XP</strong>
      </div>
      <div class="badge-status" data-badge>Conquista bloqueada: conclua o quiz ${levelLabel}</div>
    </section>

    <div class="quiz-container is-open" data-quiz-id="${quizId}">
      ${questions.map((question) => `
        <div class="quiz-block" data-correct="${question.correct}">
          <h3 class="quiz-title">${question.title}</h3>
          <div class="question-area">
            <p>${question.question}</p>
            <div class="answers">
              ${question.answers.map((answer) => `<button class="answer" data-value="${answer}">${answer}</button>`).join("")}
            </div>
          </div>
          <div class="feedback">
            <p class="feedback-text"></p>
            <button class="next">Próxima Pergunta</button>
          </div>
        </div>
      `).join("")}
      <div class="quiz-finished">
        <strong>Parabéns, você completou o exercício ${levelLabel} de ${subject.name}!</strong>
      </div>
    </div>

    <div class="content-actions">
      <a class="topic-button study" href="${subjectKey}.html">Voltar para ${subject.name}</a>
      <a class="topic-button exercise" href="../disciplinas.html">Ver outras disciplinas</a>
    </div>
  `;
}

function initQuizzes() {
  document.querySelectorAll(".quiz-container").forEach((quiz) => {
    const blocks = Array.from(quiz.querySelectorAll(".quiz-block"));
    const finished = quiz.querySelector(".quiz-finished");
    const quizId = quiz.dataset.quizId || document.title.toLowerCase();

    if (!blocks.length) {
      return;
    }

    blocks.forEach((block, index) => {
      const answers = block.querySelectorAll(".answer");
      const nextButton = block.querySelector(".next");

      block.style.display = index === 0 ? "block" : "none";
      block.querySelector(".answers").style.display = "grid";
      block.querySelector(".feedback").style.display = "none";

      answers.forEach((button) => {
        button.disabled = false;
        button.addEventListener("click", () => {
          handleQuizAnswer(block, button.dataset.value, block.dataset.correct, quizId, index, blocks.length);
        });
      });

      nextButton.addEventListener("click", () => {
        showNextQuizBlock(blocks, index, finished, quizId, blocks.length);
      });
    });

    if (finished) {
      finished.style.display = "none";
    }
  });
}

function handleQuizAnswer(block, answer, correctAnswer, quizId, questionIndex, totalQuestions) {
  const answersContainer = block.querySelector(".answers");
  const feedback = block.querySelector(".feedback");
  const feedbackText = block.querySelector(".feedback-text");
  const wasCorrect = answer === correctAnswer;

  answersContainer.querySelectorAll(".answer").forEach((button) => {
    button.disabled = true;
  });

  if (wasCorrect) {
    feedbackText.textContent = "Resposta correta!";
    awardQuizXp(quizId, questionIndex, totalQuestions);
    clearReviewMiss(quizId, questionIndex);
  } else {
    feedbackText.textContent = `Resposta errada! A resposta correta é ${correctAnswer}.`;
    saveReviewMiss(quizId, questionIndex, answer, correctAnswer, block);
  }

  answersContainer.style.display = "none";
  feedback.style.display = "block";
}

function showNextQuizBlock(blocks, currentIndex, finished, quizId, totalQuestions) {
  const currentBlock = blocks[currentIndex];
  const nextBlock = blocks[currentIndex + 1];

  currentBlock.style.display = "none";

  if (!nextBlock) {
    if (finished) {
      finished.style.display = "block";
    }
    completeQuiz(quizId, totalQuestions);
    return;
  }

  const answersContainer = nextBlock.querySelector(".answers");
  const feedback = nextBlock.querySelector(".feedback");

  nextBlock.style.display = "block";
  answersContainer.style.display = "grid";
  feedback.style.display = "none";
  answersContainer.querySelectorAll(".answer").forEach((button) => {
    button.disabled = false;
  });
}

function getProgress() {
  const empty = { xp: 0, answered: {}, completed: {}, review: {} };

  try {
    return { ...empty, ...(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)) || {}) };
  } catch (error) {
    return empty;
  }
}

function saveProgress(progress) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

function awardQuizXp(quizId, questionIndex, totalQuestions) {
  const progress = getProgress();
  const key = `${quizId}-q${questionIndex}`;

  if (!progress.answered[key]) {
    progress.answered[key] = true;
    progress.xp += 10;
    progress.lastTotal = totalQuestions;
    saveProgress(progress);
    updateGamification();
  }
}

function completeQuiz(quizId, totalQuestions) {
  const progress = getProgress();

  if (!progress.completed[quizId]) {
    progress.completed[quizId] = true;
    progress.xp += 20;
    progress.lastTotal = totalQuestions;
    saveProgress(progress);
    updateGamification();
  }
}

function getQuizMeta(quizId) {
  const [subjectKey, levelKey] = quizId.split("-");
  const subject = SUBJECTS[subjectKey];

  return {
    subjectKey,
    levelKey,
    subject,
    levelLabel: LEVEL_LABELS[levelKey] || levelKey
  };
}

function saveReviewMiss(quizId, questionIndex, selected, correct, block) {
  const progress = getProgress();
  const { subjectKey, levelKey, subject, levelLabel } = getQuizMeta(quizId);
  const key = `${quizId}-q${questionIndex}`;

  progress.review[key] = {
    quizId,
    subjectKey,
    levelKey,
    subjectName: subject?.name || "Disciplina",
    levelLabel,
    title: block.querySelector(".quiz-title")?.textContent || "Questão",
    question: block.querySelector(".question-area p")?.textContent || "",
    selected,
    correct,
    date: new Date().toISOString()
  };

  saveProgress(progress);
}

function clearReviewMiss(quizId, questionIndex) {
  const progress = getProgress();
  const key = `${quizId}-q${questionIndex}`;

  if (progress.review[key]) {
    delete progress.review[key];
    saveProgress(progress);
  }
}

function getTotalQuestions() {
  return Object.values(QUIZZES).reduce((total, subject) => {
    return total + Object.values(subject).reduce((sum, questions) => sum + questions.length, 0);
  }, 0);
}

function getTotalQuizzes() {
  return Object.values(QUIZZES).reduce((total, subject) => total + Object.keys(subject).length, 0);
}

function getSubjectProgress(subjectKey, progress) {
  const levels = QUIZZES[subjectKey] || {};
  const totalQuestions = Object.values(levels).reduce((sum, questions) => sum + questions.length, 0);
  const answered = Object.keys(progress.answered).filter((key) => key.startsWith(`${subjectKey}-`)).length;
  const completed = Object.keys(levels).filter((levelKey) => progress.completed[`${subjectKey}-${levelKey}`]).length;
  const totalLevels = Object.keys(levels).length;

  return {
    answered,
    totalQuestions,
    completed,
    totalLevels,
    percent: totalQuestions ? Math.round((answered / totalQuestions) * 100) : 0
  };
}

function getMedals(progress) {
  const totalQuestions = getTotalQuestions();
  const totalQuizzes = getTotalQuizzes();
  const answeredCount = Object.keys(progress.answered).length;
  const completedCount = Object.keys(progress.completed).length;
  const reviewCount = Object.keys(progress.review || {}).length;

  return [
    { title: "Primeiro passo", description: "Responder a primeira questão.", unlocked: answeredCount >= 1 },
    { title: "Aquecimento completo", description: "Concluir o primeiro quiz.", unlocked: completedCount >= 1 },
    { title: "100 XP", description: "Chegar a 100 pontos de experiência.", unlocked: progress.xp >= 100 },
    { title: "Sem deixar acumular", description: "Zerar a lista de revisão depois de errar.", unlocked: answeredCount > 0 && reviewCount === 0 },
    { title: "Metade da jornada", description: "Responder pelo menos metade das questões.", unlocked: answeredCount >= Math.ceil(totalQuestions / 2) },
    { title: "Projeto completo", description: "Concluir todos os quizzes disponíveis.", unlocked: completedCount >= totalQuizzes }
  ];
}

function renderDashboardPage() {
  const page = document.getElementById("dashboard-page");

  if (!page) {
    return;
  }

  const progress = getProgress();
  const totalQuestions = getTotalQuestions();
  const totalQuizzes = getTotalQuizzes();
  const answeredCount = Object.keys(progress.answered).length;
  const completedCount = Object.keys(progress.completed).length;
  const reviewItems = Object.values(progress.review || {}).sort((a, b) => new Date(b.date) - new Date(a.date));
  const medals = getMedals(progress);
  const unlockedMedals = medals.filter((medal) => medal.unlocked).length;
  const totalPercent = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  page.innerHTML = `
    <section class="dashboard-summary">
      <article class="dashboard-stat">
        <span>XP total</span>
        <strong>${progress.xp}</strong>
      </article>
      <article class="dashboard-stat">
        <span>Questões respondidas</span>
        <strong>${answeredCount}/${totalQuestions}</strong>
      </article>
      <article class="dashboard-stat">
        <span>Quizzes concluídos</span>
        <strong>${completedCount}/${totalQuizzes}</strong>
      </article>
      <article class="dashboard-stat">
        <span>Medalhas</span>
        <strong>${unlockedMedals}/${medals.length}</strong>
      </article>
    </section>

    <section class="dashboard-card">
      <div class="dashboard-heading">
        <div>
          <span class="content-level">Progresso geral</span>
          <h2>Jornada de estudos</h2>
        </div>
        <div class="dashboard-heading-actions">
          <button class="reset-progress-button" type="button" data-reset-progress>Zerar progresso</button>
          <strong>${totalPercent}%</strong>
        </div>
      </div>
      <span class="progress-track dashboard-track"><span class="progress-fill" style="width: ${totalPercent}%"></span></span>
      <div class="subject-progress-list">
        ${Object.keys(SUBJECTS).map((subjectKey) => {
          const subject = SUBJECTS[subjectKey];
          const subjectProgress = getSubjectProgress(subjectKey, progress);

          return `
            <a class="subject-progress ${subject.className}" href="matérias/${subjectKey}.html">
              <span class="subject-icon">${subject.badge}</span>
              <span>
                <strong>${subject.name}</strong>
                <small>${subjectProgress.completed}/${subjectProgress.totalLevels} níveis concluídos</small>
              </span>
              <span class="mini-progress"><span style="width: ${subjectProgress.percent}%"></span></span>
            </a>
          `;
        }).join("")}
      </div>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-card">
        <div class="dashboard-heading">
          <div>
            <span class="content-level">Conquistas</span>
            <h2>Medalhas</h2>
          </div>
        </div>
        <div class="medal-grid">
          ${medals.map((medal) => `
            <div class="medal-card ${medal.unlocked ? "is-unlocked" : ""}">
              <span>${medal.unlocked ? "✓" : "•"}</span>
              <strong>${medal.title}</strong>
              <p>${medal.description}</p>
            </div>
          `).join("")}
        </div>
      </article>

      <article class="dashboard-card">
        <div class="dashboard-heading">
          <div>
            <span class="content-level">Revisão</span>
            <h2>Erros para revisar</h2>
          </div>
          <strong>${reviewItems.length}</strong>
        </div>
        <div class="review-list">
          ${reviewItems.length ? reviewItems.map((item) => `
            <div class="review-item">
              <span>${item.subjectName} • ${item.levelLabel}</span>
              <strong>${item.title}</strong>
              <p>${item.question}</p>
              <small>Sua resposta: ${item.selected} | Correta: ${item.correct}</small>
              <a class="topic-button exercise" href="matérias/exercicios.html?materia=${item.subjectKey}&nivel=${item.levelKey}">Refazer exercício</a>
            </div>
          `).join("") : `<p class="empty-state">Nenhum erro salvo para revisão. Quando você errar uma questão, ela aparece aqui automaticamente.</p>`}
        </div>
      </article>
    </section>
  `;
}

function initDashboardActions() {
  document.querySelectorAll("[data-reset-progress]").forEach((button) => {
    button.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Tem certeza que deseja zerar seu progresso no StudyQuest?\n\nEssa ação vai apagar seu XP, quizzes concluídos, medalhas liberadas e questões salvas para revisão. Depois disso, sua jornada começa do zero novamente."
      );

      if (!confirmed) {
        return;
      }

      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      renderDashboardPage();
      initDashboardActions();
      updateGamification();
    });
  });
}

function updateGamification() {
  const panel = document.querySelector(".gamification-panel");

  if (!panel) {
    return;
  }

  const progress = getProgress();
  const quizId = panel.dataset.quizId;
  const totalQuestions = Number(panel.dataset.totalQuestions || 3);
  const answeredCount = Object.keys(progress.answered).filter((key) => key.startsWith(`${quizId}-q`)).length;
  const percent = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

  panel.querySelector("[data-xp]").textContent = progress.xp;
  panel.querySelector("[data-progress]").textContent = `${answeredCount}/${totalQuestions}`;
  panel.querySelector(".progress-fill").style.width = `${percent}%`;

  const badge = panel.querySelector("[data-badge]");
  if (badge) {
    const levelLabel = panel.dataset.levelLabel || "Básico";
    badge.textContent = progress.completed[quizId] ? `Conquista liberada: nível ${levelLabel} concluído` : `Conquista bloqueada: conclua o quiz ${levelLabel}`;
    badge.classList.toggle("is-unlocked", Boolean(progress.completed[quizId]));
  }
}
