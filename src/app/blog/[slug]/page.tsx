'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CalendarToday,
  ArrowBack,
  DirectionsBike,
  Lightbulb,
  OilBarrel,
  WaterDrop,
  Link as CadenaIcon,
  StopCircle,
  BatteryChargingFull,
  FilterAlt,
  Straighten,
  CheckCircle,
  LocalGasStation,
  Speed,
  Warning,
  Build,
  Security,
  Settings,
  Book,
  Search,
} from '@mui/icons-material';
import styles from './page.module.css';

// Post 1: Revisiones básicas
const revisionesPost = {
  slug: 'revisiones-basicas-moto-vacaciones',
  title: '10 revisiones básicas antes de salir de vacaciones con tu moto',
  date: '2025-07-04',
  category: 'Mantenimiento',
  content: {
    introduction: `Comienzan las **vacaciones** y muchos ya tenéis perfectamente planeado vuestro **viaje en moto**. Entendemos que estés loco por arrancar e iniciar tu travesía, pero te proponemos que repases antes con nosotros si tienes hechas las **10 revisiones básicas**. Podrás evitar muchos disgustos y gastos innecesarios en ruta.`,
    sections: [
      {
        id: 'ruedas',
        icon: <DirectionsBike sx={{ fontSize: 48 }} />,
        title: 'RUEDAS',
        subtitle: 'Te llevarán al fin del mundo si están en perfecto estado. Si no lo están, puedes dar con tus huesos en la carretera ya que tu calidad de frenada será peor. Frenarás menos y con menos rapidez. Piensa en ello cuando estés surcando una curva.',
        whatToCheck: [
          'Lo primero la **presión del neumático**. Es una comprobación rutinaria que hay que hacer al menos una vez al mes, pero si te vas de vacaciones y vas a iniciar un viaje largo es obligado que antes de ponerte en marcha lo compruebes. La presión del neumático **se mide en frío y en un terreno plano para evitar medidas incorrectas**. Si no te acuerdas, nada de hacerlo a ojo. **Consulta el manual del fabricante para ser preciso**.',
          'Lo segundo la **profundidad del dibujo**. El **mínimo legal son 1.6 milímetros**. Por debajo de esta medida te arriesgas a no pasar la ITV, y lo que es peor, a tener un accidente. Si lo llevas a un taller te pondrán un profundímetro, pero también es perfectamente posible que lo hagas tú. Los fabricantes de ruedas les ponen un **testigo o marca en el fondo del dibujo de la rueda**. Si ves que esa marca está al mismo nivel que el dibujo tienes que cambiar el neumático sin demora.',
          'Lo tercero, y último, el **estado de la cubierta**. A veces la presión es correcta y la profundidad del dibujo también, pero el estado de la cubierta no. **Excesivo sol, agua, humedad o un mal almacenamiento puede hacer que un neumático se acartone y pierda elasticidad**. Un truco para comprobarlo es presionar con la uña ligeramente. Si vemos que la uña queda marcada unos momentos y desaparece no habrá problema. Si no desaparece, es hora de pensar en un cambio.',
        ],
        consequences: [
          'Unas ruedas con una **presión por debajo** de lo recomendado harán que presentes **mayor resistencia al aire** y tu contacto con el suelo sea mayor del necesario. No solo **gastarás más combustible**, contaminarás más y **desgastarás las ruedas de manera incorrecta** (por los lados), sino que también **aumentarás la distancia de frenado**.',
          'Al contrario, unas **ruedas con una presión por encima** reducirán peligrosamente el contacto con el suelo lo que aumenta drásticamente el riesgo de **pérdida de control** en la conducción y **reventones** ya que las **ruedas tienden a desgastarse mucho más por el centro**.',
          'Finalmente, unas **ruedas con el dibujo o la huella desgastada** hará que tengas **menos agarre** y también que aumente la posibilidad de que hagas **aquaplaning** porque tu rueda no podrá desalojar el agua cuando circules por pavimento mojado.',
        ],
      },
      {
        id: 'luces',
        icon: <Lightbulb sx={{ fontSize: 48 }} />,
        title: 'LUCES',
        subtitle: 'Ver y ser visto es fundamental en la carretera. Si hablamos de una moto que, de por sí, tiene menos envergadura que un coche y también menos luces, su revisión es inexcusable.',
        whatToCheck: [
          'Muy fácil. Haz un **repaso de todas las luces antes de ponerte en marcha**. Si ves que alguna falla, descarta si es de la bombilla en sí o hay algún problema eléctrico. Todas y cada una de las luces de un vehículo cumplen una función, así que no prescindas de ninguna y lleva repuestos, por si acaso.',
        ],
        consequences: [
          'Evidentemente tener un accidente por falta de visibilidad. Además, si te para la Policía, te multará. **Pilotar sin luces está considerado una infracción que supone una multa de 200 euros**.',
        ],
      },
      {
        id: 'aceite',
        icon: <OilBarrel sx={{ fontSize: 48 }} />,
        title: 'ACEITE',
        subtitle: 'El aceite es el encargado de **proteger la parte interna del motor**, de mantenerlo lubricado y evitar así daños por fricción excesiva. De él depende en gran medida la buena vida y hasta la supervivencia del motor, el corazón de tu moto.',
        whatToCheck: [
          'Tienes que ver que el **nivel de aceite** es el adecuado, especialmente en épocas de verano ya que puedes notar que la pérdida de aceite es mayor. Eso se debe a que este líquido también se evapora por acción del calor. Esto es especialmente importante en una **moto** ya que, como sabrás, **el cárter tiene bastante menos capacidad que en un coche**. Como primera regla, pon tu moto recta para que la medida sea correcta y mide el nivel en frío.',
          'Dependiendo de la marca y modelo de tu moto, tendrás que hacerlo a través de un visor o con una varilla como en los coches. Sea como sea, lo importante es que el nivel esté comprendido entre el **máximo y el mínimo**. Tan malo es llevar aceite de más como de menos.',
          'Muchas veces surge la duda de cuándo hacer un **cambio de aceite completo**. Depende del tipo de moto que tengas, pero como norma general hay una horquilla **entre los 2.000 y 5.000 kilómetros**.',
        ],
        consequences: [
          'Si no cambias el aceite cuando corresponde, el motor puede sufrir daños graves por falta de lubricación, lo que puede llevar a reparaciones costosas o incluso a la necesidad de cambiar el motor completo.',
        ],
      },
      {
        id: 'refrigerante',
        icon: <WaterDrop sx={{ fontSize: 48 }} />,
        title: 'LÍQUIDO REFRIGERANTE',
        subtitle: 'El líquido refrigerante es esencial para mantener la temperatura del motor bajo control, especialmente en viajes largos o en condiciones de calor extremo.',
        whatToCheck: [
          'Revisión mensual del nivel, color y duración. El nivel de líquido refrigerante debe estar entre un máximo y un mínimo que medirás en el vaso de expansión que suele ser transparente.',
          'Comprueba que el color del líquido sea el adecuado según las especificaciones del fabricante. Si está turbio o ha cambiado de color, es momento de cambiarlo.',
        ],
        consequences: [
          'Un nivel bajo de refrigerante puede causar sobrecalentamiento del motor, lo que puede llevar a daños graves e incluso a que el motor se gripe.',
        ],
      },
      {
        id: 'cadena',
        icon: <CadenaIcon sx={{ fontSize: 48 }} />,
        title: 'CADENA',
        subtitle: 'Es el tipo de transmisión secundaria más común en las motos y **trabaja para dar potencia al motor**. Es seguramente la parte de tu moto que más mimo y cuidado requiere.',
        whatToCheck: [
          'Con las cadenas hablamos de **limpiar, engrasar y tensar**. Si te olvidas de hacer cualquiera de las tres tendrás problemas, seguro. Limpiar antes de engrasar para que elimines bien toda la suciedad, engrasar lo justo con la moto parada sin dejar pasar más de **1.000 kilómetros** sin hacerlo (**si le das mucha caña a tu moto, tendrás que hacerlo cada 500**) y, por último, tensar.',
        ],
        consequences: [
          'Los expertos consideran que una cadena de moto mal engrasada y destensada dura hasta siete veces menos. Además, ten en cuenta que la cadena **permite hacer el giro a la rueda trasera**. Puedes tener un accidente de los gordos si tienes un fallo en la cadena en pleno viaje.',
        ],
      },
      {
        id: 'frenos',
        icon: <StopCircle sx={{ fontSize: 48 }} />,
        title: 'FRENOS',
        subtitle: 'Los frenos son uno de los sistemas de seguridad más críticos de tu moto. Su correcto funcionamiento puede ser la diferencia entre llegar a tu destino o tener un accidente.',
        whatToCheck: [
          'Revisión integral de los frenos de tu moto incluirá latiguillos, pinzas, pistones, manetas, palanca, bomba, pastillas, discos y líquido.',
          'Comprueba el grosor de las pastillas de freno. Si están muy desgastadas, cámbialas antes del viaje.',
          'Verifica el nivel del líquido de frenos y su estado. Si está oscuro o tiene más de dos años, es momento de cambiarlo.',
        ],
        consequences: [
          'Unos frenos en mal estado pueden aumentar drásticamente la distancia de frenado y poner en peligro tu vida y la de otros usuarios de la carretera.',
        ],
      },
      {
        id: 'bateria',
        icon: <BatteryChargingFull sx={{ fontSize: 48 }} />,
        title: 'BATERÍA',
        subtitle: 'La batería es el corazón eléctrico de tu moto. Sin ella, no podrás arrancar y muchos sistemas eléctricos dejarán de funcionar.',
        whatToCheck: [
          'Revisión de su estado general y el nivel de carga. Es especialmente importante si la moto ha estado parado durante un período largo o si vas a realizar un viaje largo.',
          'Comprueba los terminales de la batería. Deben estar limpios y bien apretados.',
          'Si tu batería tiene tapones, verifica el nivel del electrolito.',
        ],
        consequences: [
          'Una batería descargada o en mal estado te dejará tirado sin posibilidad de arrancar la moto, especialmente problemático si estás en un lugar remoto durante tus vacaciones.',
        ],
      },
      {
        id: 'filtros',
        icon: <FilterAlt sx={{ fontSize: 48 }} />,
        title: 'FILTROS',
        subtitle: 'Los filtros son esenciales para mantener el motor limpio y funcionando correctamente. Un filtro obstruido puede causar problemas de rendimiento y daños al motor.',
        whatToCheck: [
          'Pon un nuevo filtro de aceite cada vez que hagas un cambio de aceite.',
          'Con respecto al filtro del aire, respeta las indicaciones del fabricante para mantenerlo limpio y libre de polvo y suciedad. Si no, se obstruirá.',
          'Si viajas por zonas muy polvorientas, considera cambiar el filtro de aire más frecuentemente.',
        ],
        consequences: [
          'Un filtro de aire obstruido reduce el rendimiento del motor y aumenta el consumo de combustible. Un filtro de aceite en mal estado puede permitir que partículas dañen el motor.',
        ],
      },
      {
        id: 'amortiguadores',
        icon: <Straighten sx={{ fontSize: 48 }} />,
        title: 'AMORTIGUADORES',
        subtitle: 'Los amortiguadores son fundamentales para mantener la estabilidad y el control de tu moto, especialmente en curvas y en terrenos irregulares.',
        whatToCheck: [
          'Puede ser una revisión complicada para hacer por lo que te aconsejamos que lleves tu moto a un taller para que te lo revisen con aparatos específicos que comprueben el estado óptimo de los amortiguadores.',
          'Revisa visualmente si hay fugas de aceite en los amortiguadores.',
          'Comprueba que no haya holguras o ruidos anormales al comprimir la suspensión.',
        ],
        consequences: [
          'En una moto **es especialmente importante no perder la estabilidad en las curvas**. Con unos amortiguadores defectuosos o gastados, puedes verte en problemas y tener un accidente. Además, tendrás dolores de riñones, espalda, brazos y manos por el continuo traqueteo.',
        ],
      },
      {
        id: 'equipamiento',
        icon: <CheckCircle sx={{ fontSize: 48 }} />,
        title: 'EQUIPAMIENTO',
        subtitle: 'Ya tienes tu moto a punto, lista para meterte una buena ración de kilómetros. Ahora tienes que centrarte en el equipamiento, es decir, **cómo te vas a equipar tú para protegerte y minimizar las consecuencias en un posible accidente.**',
        whatToCheck: [
          '**Casco**: Ten claro que tienen fecha de caducidad. Haz una revisión visual en busca de fisuras, grietas, raspaduras profundas o golpes importantes en la calota externa, holguras en el polímero interior, pérdida de la forma original del poliestireno interior, síntomas de envejecimiento en acolchado interior, mal funcionamiento en cierres.',
          '**Chaqueta**: Siempre decántate por modelos especialmente pensados para motoristas ya que están provistos con protecciones. Si vas a hacer un viaje por lugares con una climatología calurosa, quizás lo mejor es que optes por una chaqueta de verano.',
          '**Impermeable**: Si has previsto unas vacaciones por paisajes fríos o lluviosos, no puedes dejar de incluir en tu equipaje un impermeable de moto.',
          '**Guantes**: Cuando te caes lo primero que pones en el suelo para frenarte son las manos. Elígelos también dependiendo del clima al que vas a viajar o, mejor, prevé dos pares.',
          '**Botas**: Seguridad, protección y comodidad. Estas son las máximas que debe cumplir tu calzado de moto que, por supuesto, debe ser especial para tus viajes en moto.',
        ],
        consequences: [
          'Un equipamiento inadecuado puede aumentar significativamente las lesiones en caso de accidente. El equipamiento de protección es tu última línea de defensa.',
        ],
      },
    ],
  },
};

// Post 2: Guía de cambio de aceite
const cambioAceitePost = {
  slug: 'guia-cambio-aceite-segun-conduccion',
  title: 'Guía básica: ¿Cada cuánto deberías cambiar el aceite según tu conducción?',
  date: '2025-12-15',
  category: 'Mantenimiento',
  content: {
    introduction: `El aceite es **la sangre de tu moto**. Su función no es solo lubricar, sino también limpiar el motor y ayudar a refrigerarlo. Sin embargo, no existe una cifra mágica de kilómetros que sirva para todos. Seguí siempre la **tabla de mantenimiento del manual**, pero también tene en cuenta que afecta cómo y dónde manejas. Acá te ayudamos a descubrir cuál es tu perfil de conducción y cuándo te toca visitar el taller.`,
    sections: [
      {
        id: 'conduccion-urbana',
        icon: <LocalGasStation sx={{ fontSize: 48 }} />,
        title: '1. Conducción Urbana (El uso más exigente)',
        subtitle: 'Si usás la moto para ir al trabajo, repartos o trayectos cortos en la ciudad con muchos semáforos, tu motor sufre más de lo que creés.',
        whatToCheck: [
          '**El problema**: El motor no llega a su temperatura óptima de funcionamiento en trayectos cortos, y el "arranca-frena" genera mucho residuo.',
          '**Recomendación**: Cambiar el aceite cada **2.500 a 5.000 km** (o cada **1 año**, lo que ocurra primero), incluso si usas aceite sintético.',
        ],
        consequences: [],
      },
      {
        id: 'conduccion-ruta',
        icon: <Speed sx={{ fontSize: 48 }} />,
        title: '2. Conducción en Ruta o Viajes',
        subtitle: 'Si solés salir a la ruta a velocidades constantes y trayectos largos, el motor trabaja de forma mucho más eficiente y relajada.',
        whatToCheck: [
          '**El beneficio**: Al mantener una temperatura constante y pocas revoluciones bruscas, el aceite mantiene sus propiedades por más tiempo.',
          '**Recomendación**: Podés estirar el cambio hasta los **7.000 o 10.000 km**, siempre siguiendo lo que indique el manual de tu fabricante.',
        ],
        consequences: [],
      },
      {
        id: 'conduccion-deportiva',
        icon: <DirectionsBike sx={{ fontSize: 48 }} />,
        title: '3. Conducción Deportiva o "Off-Road"',
        subtitle: 'Si te gusta llevar el motor a altas revoluciones o frecuentas caminos de tierra y barro.',
        whatToCheck: [
          '**El riesgo**: El calor extremo degrada las moléculas del aceite más rápido, y el polvo ambiental puede contaminar el sistema.',
          '**Recomendación**: Revisar el nivel cada semana y cambiar el aceite cada **2.000 o 3.000 km**.',
        ],
        consequences: [],
      },
      {
        id: 'moto-parada',
        icon: <StopCircle sx={{ fontSize: 48 }} />,
        title: '¿Qué pasa si la moto está mucho tiempo parada?',
        subtitle: 'Este es el error más común. El aceite se oxida y pierde propiedades dentro del cárter, aunque la moto no se mueva.',
        whatToCheck: [
          '**Regla de oro**: Si pasó un **año desde tu último service**, tenés que cambiar el aceite aunque solo hayas hecho 500 kilómetros.',
        ],
        consequences: [],
      },
      {
        id: 'senales-aceite-viejo',
        icon: <CheckCircle sx={{ fontSize: 48 }} />,
        title: 'Tres señales de que tu aceite ya no sirve:',
        subtitle: 'Aprende a reconocer cuándo es momento de cambiar el aceite antes de que sea demasiado tarde.',
        whatToCheck: [
          '**Color y textura**: Si está **negro carbón** y se siente **arenoso al tacto** entre los dedos.',
          '**Ruidos mecánicos**: Escuchas un **golpeteo metálico más fuerte** de lo normal cuando el motor está caliente.',
          '**Dificultad en los cambios**: Si sentís la caja de cambios **"dura"** o te cuesta encontrar el **punto muerto**.',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 3: Revisión cuando la moto estuvo parada
const motoParadaPost = {
  slug: 'moto-parada-revision-puesta-punto',
  title: '¿Tu moto estuvo parada? 5 cosas que debés revisar antes de arrancar 🛠️',
  date: '2025-12-16',
  category: 'Mantenimiento',
  content: {
    introduction: `Dejar la moto detenida por semanas o meses no le hace bien. Los fluidos se degradan y los componentes se resecan. Si estás por volver a las pistas, chequeá estos puntos críticos.`,
    sections: [
      {
        id: 'bateria',
        icon: <BatteryChargingFull sx={{ fontSize: 48 }} />,
        title: '1. La Batería: El punto más débil',
        subtitle: 'Es lo primero que falla. Aunque esté apagada, la moto tiene pequeños consumos (reloj, alarma) que agotan la batería.',
        whatToCheck: [
          '**Señal**: Al dar contacto, las luces son débiles o el motor de arranque no tiene fuerza.',
          '**Tip**: Si no la vas a usar por más de 10 días, desconectá el borne negativo o usá un mantenedor de carga.',
        ],
        consequences: [],
      },
      {
        id: 'combustible',
        icon: <LocalGasStation sx={{ fontSize: 48 }} />,
        title: '2. El Combustible "Podrido"',
        subtitle: 'La nafta moderna se degrada después de los 30 a 60 días. Forma un barniz pegajoso que tapa los conductos del carburador o los inyectores.',
        whatToCheck: [
          '**Consecuencia**: La moto no arranca, se apaga sola o tiene tirones al acelerar.',
        ],
        consequences: [],
      },
      {
        id: 'neumaticos',
        icon: <DirectionsBike sx={{ fontSize: 48 }} />,
        title: '3. Neumáticos: La deformación silenciosa',
        subtitle: 'Al estar en la misma posición, el peso de la moto deforma la estructura del neumático (efecto "plano"). Además, el caucho se reseca y pierde agarre.',
        whatToCheck: [
          '**Qué hacer**: Rotá periódicamente los neumáticos para evitar deformaciones y revisá la presión antes de salir. Si ves grietas en los laterales, el neumático está **"cristalizado"** y es peligroso.',
        ],
        consequences: [],
      },
      {
        id: 'fluidos-oxidados',
        icon: <OilBarrel sx={{ fontSize: 48 }} />,
        title: '4. Fluidos oxidados (Aceite y Frenos)',
        subtitle: 'El aceite acumula humedad y el líquido de frenos absorbe agua del ambiente, lo que puede oxidar el sistema por dentro.',
        whatToCheck: [
          '**Regla de oro**: Si la moto estuvo parada más de un año, el cambio de aceite y filtro es obligatorio, sin importar los kilómetros.',
        ],
        consequences: [],
      },
      {
        id: 'retenes-mangueras',
        icon: <Warning sx={{ fontSize: 48 }} />,
        title: '5. Retenes y mangueras resecos',
        subtitle: 'Las gomas necesitan movimiento y lubricación para ser elásticas. Cuando se secan, aparecen las famosas pérdidas de aceite en los barrales o fugas de refrigerante.',
        whatToCheck: [
          'Si notás fugas o manchas de aceite o refrigerante, es probable que los retenes y mangueras necesiten revisión o reemplazo.',
        ],
        consequences: [],
      },
      {
        id: 'checklist',
        icon: <CheckCircle sx={{ fontSize: 48 }} />,
        title: 'Checklist: Antes de darle marcha',
        subtitle: 'Antes de darle marcha a esa moto que estuvo guardada, revisá estos puntos clave:',
        whatToCheck: [
          '**Voltaje de Batería**: ¿Tiene fuerza el arranque o las luces parpadean? Si estuvo más de 1 mes parada, es probable que necesite carga.',
          '**Presión y Grietas**: Inflá los neumáticos a la presión del manual. Buscá grietas en los costados; si las tiene, el caucho está reseco.',
          '**Nivel de Aceite**: Revisá el ojo de buey o la varilla. Si el aceite se ve muy oscuro o espeso, cambialo.',
          '**Fugas de Líquidos**: Mirá el suelo y los barrales de suspensión. ¿Hay manchas de aceite o refrigerante?',
          '**Estado de la Cadena**: Si tiene óxido superficial, limpiala y lubricala bien. Si está rígida, no la fuerces.',
          '**Líquido de Frenos**: Verificá que el nivel en el manillar no haya bajado y que la maneta no se sienta **"esponjosa"**.',
          '**Luces y Seguridad**: Probá alta, baja, giros y luz de freno. ¡Que te vean es vital!',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 4: Guía de mantenimiento del carburador
const carburadorPost = {
  slug: 'guia-mantenimiento-carburador',
  title: 'Guía de mantenimiento del carburador 🛠️',
  date: '2025-12-17',
  category: 'Mantenimiento',
  content: {
    introduction: `El carburador es el encargado de preparar la mezcla de aire y nafta que hace que tu motor cobre vida. En Argentina, debido a las impurezas que a veces trae el combustible, este componente suele ensuciarse más rápido de lo normal.`,
    sections: [
      {
        id: 'senales',
        icon: <Warning sx={{ fontSize: 48 }} />,
        title: '🚩 3 Señales de que tu carburador pide auxilio:',
        subtitle: 'Reconocé estos síntomas antes de que el problema empeore.',
        whatToCheck: [
          '**Dificultad para arrancar en frío**: Tenés que usar el cebador más de la cuenta.',
          '**Ralentí inestable**: La moto se apaga sola cuando frenás en un semáforo.',
          '**Explosiones o tirones**: Sentís que la moto **"se queda"** cuando acelerás de golpe.',
        ],
        consequences: [],
      },
      {
        id: 'cuando-mantenimiento',
        icon: <CalendarToday sx={{ fontSize: 48 }} />,
        title: '📅 ¿Cada cuánto hacerle mantenimiento?',
        subtitle: 'No hay un kilometraje exacto, pero la recomendación profesional es:',
        whatToCheck: [
          '**Limpieza preventiva**: Una vez al año o cada **10.000 - 12.000 km**.',
          '**Si la moto estuvo parada**: Si pasó más de 2 meses sin uso, la nafta vieja habrá formado un **"barniz"** que tapa los chicleres. Limpieza obligatoria.',
          '**Uso con filtros alternativos**: Si usás filtros de aire de baja calidad, deberás revisarlo cada **5.000 km**.',
        ],
        consequences: [],
      },
      {
        id: 'mantenimiento-basico',
        icon: <Build sx={{ fontSize: 48 }} />,
        title: '🔧 Cómo hacerle un mantenimiento básico (Paso a paso)',
        subtitle: 'Si te animás a meter mano, estos son los pasos fundamentales:',
        whatToCheck: [
          '**Desmontaje y drenaje**: Cerrar el paso de nafta y quitar la cuba (la parte inferior) para vaciar el combustible viejo.',
          '**Limpieza de "Chicleres"**: Son los pequeños tornillos con orificios por donde pasa la nafta. **Nunca los limpies con alambre**, podrías agrandar el paso y arruinar la mezcla. Usá aire comprimido o un pincel fino.',
          '**Uso de productos específicos**: Usá un spray **"Limpia Carburadores"** de buena calidad. Remueve el barniz y la suciedad pegada sin dañar el metal.',
          '**Revisión de juntas y gomas**: Si el **"O-ring"** de la cuba está estirado o reseco, va a perder nafta. Es mejor cambiarlo siempre.',
          '**Regulación del aire**: Una vez armado, hay que regular el tornillo de mezcla para que la combustión sea perfecta (ni muy **"pobre"** ni muy **"rica"**).',
        ],
        consequences: [],
      },
      {
        id: 'error-costoso',
        icon: <StopCircle sx={{ fontSize: 48 }} />,
        title: '⚠️ El error que te puede costar caro',
        subtitle: 'Mucha gente intenta limpiar el carburador sin sacar los orings de goma y usa solventes fuertes que los **"inflan"** o los pudren.',
        whatToCheck: [
          'Una mala regulación puede hacer que tu moto consuma el doble de nafta o que el motor caliente de más.',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 5: Casco vencido
const cascoVencidoPost = {
  slug: 'casco-vencido-verdad-que-pocos-te-cuentan',
  title: '¿Tu casco está vencido? La verdad que pocos te cuentan ⚠️',
  date: '2025-12-18',
  category: 'Seguridad',
  content: {
    introduction: `Muchos motociclistas creen que si el casco no tiene rayones y nunca se golpeó, está como nuevo. Error. El casco tiene **"fecha de vencimiento"** y usar uno viejo es casi lo mismo que no llevar nada. Aquí te explicamos por qué y cómo saber si el tuyo ya cumplió su ciclo.`,
    sections: [
      {
        id: 'por-que-vencen',
        icon: <Security sx={{ fontSize: 48 }} />,
        title: '🕒 ¿Por qué vencen si son de plástico?',
        subtitle: 'El problema no es la cáscara exterior, sino el EPS (Poliestireno Expandido), que es la capa de "telgopor" de alta densidad que está adentro.',
        whatToCheck: [
          '**Se reseca**: Con el tiempo, el EPS pierde su humedad y elasticidad. Se vuelve rígido y quebradizo.',
          '**No absorbe**: Un EPS vencido, en lugar de comprimirse para absorber el impacto, se parte o transmite toda la fuerza directamente a tu cráneo.',
          '**Sudor y químicos**: El sudor, el vaho, el fijador para el pelo y hasta los vapores del combustible degradan los materiales internos día tras día.',
        ],
        consequences: [],
      },
      {
        id: 'regla-5-anos',
        icon: <CalendarToday sx={{ fontSize: 48 }} />,
        title: '📅 La regla de los 5 años',
        subtitle: 'A nivel internacional, la recomendación de fabricantes como Shoei, LS2 o Bell es clara:',
        whatToCheck: [
          '**Uso regular**: Cambiar cada **5 años**.',
          '**Sin uso (en caja)**: Cambiar a los **7 años** desde su fecha de fabricación (los materiales también se degradan guardados).',
        ],
        consequences: [],
      },
      {
        id: 'como-saber',
        icon: <Search sx={{ fontSize: 48 }} />,
        title: '🔍 Cómo saber si el tuyo no va más',
        subtitle: 'Revisá estos 3 puntos ahora mismo:',
        whatToCheck: [
          '**La fecha de fabricación**: Buscá bajo el tapizado interno. Suele haber una etiqueta blanca o un grabado en el EPS con el mes y año de producción.',
          '**Efecto "suelto"**: Si sentís que el casco ahora te queda más flojo que cuando lo compraste, no es que tu cabeza achicó; es que las almohadillas y el EPS se comprimieron y ya no sujetan.',
          '**El estado de las correas**: Si el cierre micrométrico o la correa están deshilachados o resecos, el riesgo de que el casco salga volando en un accidente es altísimo.',
        ],
        consequences: [],
      },
      {
        id: 'un-solo-golpe',
        icon: <StopCircle sx={{ fontSize: 48 }} />,
        title: '🛑 El factor "Un solo golpe"',
        subtitle: 'Esto es vital: El casco es un elemento de seguridad descartable. Está diseñado para destruirse mientras absorbe un impacto.',
        whatToCheck: [
          'Si tu casco sufrió una caída desde más de **1 metro de altura** (incluso sin vos arriba), el EPS pudo haberse micro-fisurado. Ese casco ya no sirve.',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 6: Pastillas de freno
const pastillasFrenoPost = {
  slug: '5-senales-pastillas-freno-cambio-urgente',
  title: '5 señales de que tus pastillas de freno necesitan cambio urgente',
  date: '2025-12-19',
  category: 'Mantenimiento',
  content: {
    introduction: `El sistema de frenado es el componente de seguridad más importante de tu moto. Sin embargo, al ser un desgaste progresivo, muchas veces nos acostumbramos a que frene **"un poco menos"** hasta que es demasiado tarde. Aquí te enseñamos a identificar cuándo tus pastillas han llegado al límite de su vida útil.`,
    sections: [
      {
        id: 'sonido-metalico',
        icon: <Warning sx={{ fontSize: 48 }} />,
        title: '1. El sonido metálico (Chirrido)',
        subtitle: 'Si al frenar escuchas un chillido agudo o un sonido de fricción metálica, es la señal de alerta más clara.',
        whatToCheck: [
          '**Por qué sucede**: Muchas pastillas incluyen una pequeña pieza metálica que, al llegar al mínimo de material, roza el disco para avisarte que es hora de pasar por el taller.',
          '**El riesgo**: Si sigues rodando así, empezarás a rayar el disco de freno, lo que te costará mucho más caro que un simple cambio de pastillas.',
        ],
        consequences: [],
      },
      {
        id: 'perdida-potencia',
        icon: <StopCircle sx={{ fontSize: 48 }} />,
        title: '2. Pérdida de potencia de frenado (Fading)',
        subtitle: '¿Sentís que tenes que apretar la maneta o el pedal con mucha más fuerza que antes para detener la moto?',
        whatToCheck: [
          'Esto sucede cuando el material de fricción se cristaliza por el calor o está tan delgado que ya no muerde el disco con eficacia. Si la moto **"sigue de largo"** más de lo normal, no esperes más.',
          '**Precaución**: Chequea el disco de frenos, la presencia de aceites o lubricantes afectará peligrosamente tu frenada.',
        ],
        consequences: [],
      },
      {
        id: 'tacto-esponjoso',
        icon: <Build sx={{ fontSize: 48 }} />,
        title: '3. Tacto "esponjoso" en la maneta',
        subtitle: 'Si al apretar el freno sientes que la maneta llega casi hasta el puño o se siente blanda, tenes un problema.',
        whatToCheck: [
          '**Causa común**: Aire en las líneas de freno o desgaste excesivo de las pastillas. Esto hace que los pistones de la pinza tengan que salir más de lo debido, bajando el nivel de líquido y afectando la presión. Permitiendo que el sistema pierda firmeza.',
        ],
        consequences: [],
      },
      {
        id: 'nivel-bajo',
        icon: <WaterDrop sx={{ fontSize: 48 }} />,
        title: '4. Nivel bajo de líquido de frenos',
        subtitle: 'Antes de rellenar el depósito de líquido de frenos, mira tus pastillas.',
        whatToCheck: [
          'A medida que la pastilla se gasta, el líquido baja para ocupar ese espacio en el sistema. Si el nivel en el visor de tu manillar está cerca del mínimo, es muy probable que tus pastillas estén en las últimas.',
          '**Recorda**: El líquido de frenos debe reemplazarse cada **2 años**. Lo mejor, es realizar un service completo de frenos.',
        ],
        consequences: [],
      },
      {
        id: 'inspeccion-visual',
        icon: <CheckCircle sx={{ fontSize: 48 }} />,
        title: '5. Inspección visual: Menos de 2 mm',
        subtitle: 'La mayoría de las pastillas tienen unas pequeñas ranuras o surcos en la superficie.',
        whatToCheck: [
          '**La regla de oro**: Si ya no puedes ver esos surcos o si el espesor del material de fricción es menor a **2 mm**, el cambio es obligatorio y urgente.',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 7: Limpiar y tensar cadena
const limpiarCadenaPost = {
  slug: 'como-limpiar-tensar-cadena-moto-paso-paso',
  title: 'Cómo limpiar y tensar la cadena de tu moto paso a paso',
  date: '2025-12-20',
  category: 'Mantenimiento',
  content: {
    introduction: `La cadena es el alma de la tracción de tu moto. Una cadena sucia o floja no solo reduce el rendimiento, sino que puede ser peligrosa. Te enseñamos cómo hacerle un mantenimiento en casa.`,
    sections: [
      {
        id: 'herramientas',
        icon: <Build sx={{ fontSize: 48 }} />,
        title: '🛠️ Herramientas necesarias',
        subtitle: 'Prepará estos elementos antes de empezar:',
        whatToCheck: [
          'Limpiador de cadenas (o quita grasas cítrico).',
          'Cepillo de cerdas duras (específico para cadenas).',
          'Lubricante de cadena (Valvulina (SAE 80W90) o lubricante en spray).',
          'Llaves fijas o de tubo (para el eje trasero).',
          'Cinta métrica o regla.',
        ],
        consequences: [],
      },
      {
        id: 'limpieza',
        icon: <FilterAlt sx={{ fontSize: 48 }} />,
        title: 'Paso 1: Limpieza profunda',
        subtitle: 'Antes de ajustar, hay que limpiar.',
        whatToCheck: [
          'Rocía la cadena con el limpiador mientras giras la rueda trasera (siempre con el motor apagado). Usa el cepillo para remover la grasa vieja y la tierra acumulada en los eslabones.',
          '**Tip Pro**: Limpia también el piñón de ataque (retirando la tapa lateral) para evitar que la suciedad acumulada vuelva a ensuciar la cadena nueva.',
        ],
        consequences: [],
      },
      {
        id: 'secado',
        icon: <CheckCircle sx={{ fontSize: 48 }} />,
        title: 'Paso 2: Secado y revisión',
        subtitle: 'Seca la cadena con un trapo viejo o papel.',
        whatToCheck: [
          'Aprovecha este momento para revisar si hay eslabones gripados (que no se mueven) o si los dientes de la corona están muy afilados. Si ves esto, es momento de un cambio de kit de arrastre.',
        ],
        consequences: [],
      },
      {
        id: 'medir-tension',
        icon: <Straighten sx={{ fontSize: 48 }} />,
        title: 'Paso 3: Medir la tensión actual',
        subtitle: 'La mayoría de las motos requieren una holgura de entre 25 mm y 35 mm. ¡Revisa el manual de tu moto para el dato exacto!',
        whatToCheck: [
          'Busca el punto medio entre el piñón y la corona.',
          'Empuja la cadena hacia arriba y hacia abajo con el dedo.',
          'Mide la distancia total del recorrido. Si supera los **35 mm**, está demasiado floja.',
        ],
        consequences: [],
      },
      {
        id: 'lubricacion',
        icon: <OilBarrel sx={{ fontSize: 48 }} />,
        title: 'Paso 4: Lubricación',
        subtitle: 'Con la cadena limpia, aplica el lubricante.',
        whatToCheck: [
          'Aplica el lubricante por la cara interna de la cadena mientras giras la rueda. Esto permite que la fuerza centrífuga empuje el aceite hacia el interior de los eslabones mientras rodás.',
        ],
        consequences: [],
      },
      {
        id: 'ajuste-tensado',
        icon: <Settings sx={{ fontSize: 48 }} />,
        title: 'Paso 5: Ajuste y tensado final',
        subtitle: 'Afloja la tuerca del eje de la rueda trasera (solo un poco, no la quites).',
        whatToCheck: [
          'Afloja la contratuerca y usa los tornillos tensores a ambos lados del basculante.',
          '**Importante**: Gira la misma cantidad de vueltas en ambos lados usando las marcas de referencia para que la rueda no quede cruzada.',
          'Aprieta nuevamente la tuerca del eje.',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 8: Neumáticos
const neumaticosPost = {
  slug: 'neumaticos-cuando-cambiarlos-presion-kits-reparacion',
  title: 'Neumáticos: Cuándo cambiarlos, cómo revisar la presión adecuada y kits de reparación de pinchazos',
  date: '2025-12-21',
  category: 'Mantenimiento',
  content: {
    introduction: `Las cubiertas son el componente más subestimado de la moto, cuando en realidad son lo único que nos mantiene pegados al piso. Con compuestos cada vez más específicos, entender cómo cuidarlos es fundamental para tu seguridad y para cuidar el bolsillo.`,
    sections: [
      {
        id: 'cuando-cambiar',
        icon: <Warning sx={{ fontSize: 48 }} />,
        title: '1. ¿Cuándo es momento de cambiar los neumáticos?',
        subtitle: 'No esperes a que la rueda esté lisa. Existen tres indicadores críticos:',
        whatToCheck: [
          '**Testigos de desgaste (TWI)**: Si te fijás en las ranuras, vas a ver unos pequeños puentes de goma. Cuando el dibujo llega al ras de esos testigos, la cubierta cumplió su ciclo. Andar con menos que eso es jugársela, especialmente con lluvia.',
          '**Fecha de caducidad (DOT)**: El caucho se degrada. Revisa el código DOT (cuatro dígitos: semana y año). Se recomienda cambiarlos si tienen más de **5 años de uso** o **10 años desde su fabricación**, incluso si el dibujo se ve bien.',
          '**Kilometraje**: Aunque varía según el compuesto (blando vs. duro), un neumático trasero suele durar entre **5,000 y 10,000 km**, mientras que el delantero puede llegar a los **15,000 km**.',
          '**Deformaciones**: Si sentís que la moto **"vibra"** o **"salta"** cuando vas despacio, puede que la cubierta esté deformada.',
        ],
        consequences: [],
      },
      {
        id: 'presion-adecuada',
        icon: <Speed sx={{ fontSize: 48 }} />,
        title: '2. Cómo revisar la presión adecuadamente',
        subtitle: 'La presión incorrecta causa un desgaste irregular, pérdida de agarre y aumenta el consumo.',
        whatToCheck: [
          '**Siempre en frío**: Medí la presión antes de rodar o tras haber estado parado al menos **2 horas**. El calor aumenta la presión y da lecturas falsas.',
          '**Usá un manómetro propio**: No te fíes ciegamente de los picos de las estaciones de servicio; suelen estar muy maltratados. Lo ideal es tener un medidor propio de buena calidad.',
          '**Carga y pasajero**: Si vas a viajar con carga o acompañante, incrementa la presión según la tabla del fabricante (suele venir un sticker en el basculante o protector de cadena).',
        ],
        consequences: [],
      },
      {
        id: 'pinchazos',
        icon: <Build sx={{ fontSize: 48 }} />,
        title: '3. Pinchazos: Que no te arruinen la salida',
        subtitle: 'Hoy la mayoría de las motos usan cubiertas sin cámara (Tubeless), lo que nos da una ventaja enorme si llevamos el equipo adecuado:',
        whatToCheck: [
          '**Kit de reparación (Tarugos)**: Es una herramienta indispensable en tu kit de viaje. Un buen kit de **"tarugos"** o **"mechas"** te permite sellar la pinchadura en pocos minutos y seguir camino.',
          '**Cápsulas de CO2 o inflador portátil a batería**: Son el complemento ideal para inflar la rueda al instante sin esfuerzo físico, algo fundamental si te toca pinchar bajo el sol o en una zona complicada.',
          '**El límite de la reparación**: El tarugo es una solución para salir del paso. Si el daño fue en el lateral de la cubierta o el tajo es muy grande, por seguridad, reemplaza la cubierta lo antes posible.',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 9: El manual
const manualPost = {
  slug: 'manual-clave-para-no-gastar-de-mas',
  title: 'El manual: La clave para no gastar de más',
  date: '2025-12-22',
  category: 'Consejos',
  content: {
    introduction: `En el taller lo vemos a diario: muchas roturas costosas se evitarían simplemente leyendo el manual. Con motos que cada vez equipan más tecnológica, el manual es tu mejor herramienta por estas razones:`,
    sections: [
      {
        id: 'datos-precisos',
        icon: <CheckCircle sx={{ fontSize: 48 }} />,
        title: 'Datos precisos',
        subtitle: 'Te da la información exacta que tu modelo necesita.',
        whatToCheck: [
          'Te da la presión exacta de cubiertas, el tipo de aceite y el ajuste de cadena que tu modelo necesita, sin adivinar.',
        ],
        consequences: [],
      },
      {
        id: 'mantenimiento-preventivo',
        icon: <CalendarToday sx={{ fontSize: 48 }} />,
        title: 'Mantenimiento preventivo',
        subtitle: 'Te indica el cronograma de service oficial.',
        whatToCheck: [
          'Te indica el cronograma de service oficial para que cambies los componentes antes de que fallen y afecten al motor.',
        ],
        consequences: [],
      },
      {
        id: 'codigos-error',
        icon: <Warning sx={{ fontSize: 48 }} />,
        title: 'Códigos de error',
        subtitle: 'Te ayuda a entender qué significa esa luz que prendió en el tablero.',
        whatToCheck: [
          'Te ayuda a entender qué significa esa luz que prendió en el tablero y si es seguro seguir andando.',
        ],
        consequences: [],
      },
      {
        id: 'ajuste-suspension',
        icon: <Settings sx={{ fontSize: 48 }} />,
        title: 'Ajuste de Suspensión',
        subtitle: 'Te enseña a regular la dureza de la moto.',
        whatToCheck: [
          'Te enseña a regular la dureza de la moto según tu peso o si vas con acompañante, mejorando el agarre en curvas.',
        ],
        consequences: [],
      },
      {
        id: 'ablande-correcto',
        icon: <DirectionsBike sx={{ fontSize: 48 }} />,
        title: 'El "Ablande" Correcto',
        subtitle: 'Si es 0km, te indica a qué revoluciones llevarla los primeros kilómetros.',
        whatToCheck: [
          'Si es 0km, te indica a qué revoluciones llevarla los primeros kilómetros para que el motor te dure toda la vida.',
        ],
        consequences: [],
      },
      {
        id: 'fusibles-emergencias',
        icon: <Lightbulb sx={{ fontSize: 48 }} />,
        title: 'Fusibles y Emergencias',
        subtitle: 'Te muestra dónde están los repuestos eléctricos.',
        whatToCheck: [
          'Te muestra dónde están los repuestos eléctricos para que un fusible quemado no te deje tirado en la ruta.',
        ],
        consequences: [],
      },
      {
        id: 'donde-descargarlo',
        icon: <Book sx={{ fontSize: 48 }} />,
        title: '¿No lo tenés?',
        subtitle: 'Podés descargarlo gratis en PDF desde las webs oficiales de las marcas en Argentina.',
        whatToCheck: [
          'Podés descargarlo gratis en PDF desde las webs oficiales de las marcas en Argentina (como Honda, Yamaha o Kawasaki).',
        ],
        consequences: [],
      },
    ],
  },
};

// Post 10: Batería
const bateriaPost = {
  slug: 'bateria-como-evitar-muerte-por-falta-uso',
  title: 'Batería: Cómo evitar que muera por falta de uso',
  date: '2025-12-23',
  category: 'Mantenimiento',
  content: {
    introduction: `Es un clásico: vas a arrancar la moto después de unos días y solo escuchás un **"clic"**. Las motos modernas tienen consumos constantes (alarmas, tableros, sensores) que agotan la batería aunque la moto esté apagada.`,
    sections: [
      {
        id: 'evitar-arranque-corto',
        icon: <StopCircle sx={{ fontSize: 48 }} />,
        title: 'Evitá el arranque corto',
        subtitle: 'Prender la moto 5 minutos en el garaje es peor que dejarla apagada.',
        whatToCheck: [
          'El arranque consume mucha energía y el alternador necesita al menos **20 minutos de rodaje** para recuperar esa carga.',
        ],
        consequences: [],
      },
      {
        id: 'desconectar-borne',
        icon: <BatteryChargingFull sx={{ fontSize: 48 }} />,
        title: 'Desconectá el borne negativo',
        subtitle: 'Si la vas a dejar quieta más de dos semanas, desconectá el cable negro.',
        whatToCheck: [
          'Así evitás el **"consumo parásito"** de la electrónica.',
        ],
        consequences: [],
      },
      {
        id: 'mantenedor',
        icon: <Settings sx={{ fontSize: 48 }} />,
        title: 'Invertí en un mantenedor',
        subtitle: 'Un cargador/ mantenedor inteligente es la solución definitiva.',
        whatToCheck: [
          'Lo dejás conectado y el aparato gestiona la carga de forma automática, prolongando la vida útil de la batería por años.',
        ],
        consequences: [],
      },
      {
        id: 'ojo-sulfato',
        icon: <Warning sx={{ fontSize: 48 }} />,
        title: 'Ojo con el sulfato',
        subtitle: 'Si ves un polvo blanco en los bornes, limpialos.',
        whatToCheck: [
          'Esa suciedad genera resistencia y dificulta el arranque.',
        ],
        consequences: [],
      },
    ],
  },
};

// Mapa de posts por slug
const postsMap: Record<string, typeof revisionesPost | typeof cambioAceitePost | typeof motoParadaPost | typeof carburadorPost | typeof cascoVencidoPost | typeof pastillasFrenoPost | typeof limpiarCadenaPost | typeof neumaticosPost | typeof manualPost | typeof bateriaPost> = {
  'revisiones-basicas-moto-vacaciones': revisionesPost,
  'guia-cambio-aceite-segun-conduccion': cambioAceitePost,
  'moto-parada-revision-puesta-punto': motoParadaPost,
  'guia-mantenimiento-carburador': carburadorPost,
  'casco-vencido-verdad-que-pocos-te-cuentan': cascoVencidoPost,
  '5-senales-pastillas-freno-cambio-urgente': pastillasFrenoPost,
  'como-limpiar-tensar-cadena-moto-paso-paso': limpiarCadenaPost,
  'neumaticos-cuando-cambiarlos-presion-kits-reparacion': neumaticosPost,
  'manual-clave-para-no-gastar-de-mas': manualPost,
  'bateria-como-evitar-muerte-por-falta-uso': bateriaPost,
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const blogPost = postsMap[slug];

  if (!blogPost) {
    return (
      <Box className={styles.pageWrapper}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: 'var(--text-primary)', mb: 2 }}>
            Post no encontrado
          </Typography>
          <Link href="/blog" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            Volver al Blog
          </Link>
        </Container>
      </Box>
    );
  }
  return (
    <Box className={styles.pageWrapper}>
      {/* Hero Section */}
      <Box className={styles.hero}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, md: 6 },
              color: 'var(--text-primary)',
            }}
          >
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                marginBottom: '2rem',
                fontSize: '0.9375rem',
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
              Volver al Blog
            </Link>
            <Chip
              label={blogPost.category}
              sx={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontFamily: 'var(--font-family-body)',
                textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(139, 26, 26, 0.6)',
                lineHeight: 1.2,
                color: 'var(--text-primary)',
              }}
            >
              {blogPost.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <CalendarToday sx={{ fontSize: 18 }} />
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                {new Date(blogPost.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contenido */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        {/* Introducción */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius-lg)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.8,
              color: 'var(--text-primary)',
            }}
            dangerouslySetInnerHTML={{
              __html: blogPost.content.introduction.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        </Paper>

        {/* Secciones */}
        {blogPost.content.sections.map((section, index) => (
          <Box key={section.id} sx={{ mb: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                backgroundColor: 'var(--bg-dark-secondary)',
                borderRadius: 'var(--border-radius-lg)',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ color: 'var(--primary)' }}>{section.icon}</Box>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                  lineHeight: 1.7,
                  mb: 3,
                }}
                dangerouslySetInnerHTML={{
                  __html: section.subtitle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
            </Paper>

            {/* Contenido de la sección */}
            {section.whatToCheck && section.whatToCheck.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {blogPost.slug !== 'guia-cambio-aceite-segun-conduccion' && (
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      mb: 2,
                      fontSize: { xs: '1.125rem', md: '1.25rem' },
                    }}
                  >
                    ¿Qué hay que revisar?
                  </Typography>
                )}
                <List>
                  {section.whatToCheck.map((item, itemIndex) => (
                    <ListItem key={itemIndex} sx={{ alignItems: 'flex-start', py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                        <CheckCircle sx={{ color: 'var(--primary)', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: { xs: '0.9375rem', md: '1rem' },
                              lineHeight: 1.7,
                              color: 'var(--text-primary)',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Qué me puede pasar */}
            {section.consequences && section.consequences.length > 0 && (
              <Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'var(--primary)',
                    mb: 2,
                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                  }}
                >
                  ¿Qué me puede pasar si no hago la revisión?
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    backgroundColor: 'rgba(139, 26, 26, 0.1)',
                    borderLeft: '4px solid var(--primary)',
                    borderRadius: 'var(--border-radius-md)',
                  }}
                >
                  {section.consequences.map((consequence, consIndex) => (
                    <Typography
                      key={consIndex}
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9375rem', md: '1rem' },
                        lineHeight: 1.7,
                        color: 'var(--text-primary)',
                        mb: consIndex < section.consequences.length - 1 ? 1.5 : 0,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: consequence.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                      }}
                    />
                  ))}
                </Paper>
              </Box>
            )}

            {index < blogPost.content.sections.length - 1 && (
              <Divider sx={{ mt: 4, mb: 2 }} />
            )}
          </Box>
        ))}

        {/* Tabla de Referencia - Solo para post de aceite */}
        {blogPost.slug === 'guia-cambio-aceite-segun-conduccion' && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mt: 6,
              backgroundColor: 'var(--bg-dark-secondary)',
              borderRadius: 'var(--border-radius-lg)',
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 700,
                color: 'var(--text-primary)',
                mb: 3,
                textAlign: 'center',
              }}
            >
              Tabla de Referencia: Tipo de Aceite
            </Typography>
            <TableContainer>
              <Table sx={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(139, 26, 26, 0.2)' }}>
                    <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Tipo de Aceite
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Conducción Urbana
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Conducción en Ruta
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Conducción Deportiva
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Aceite Mineral
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      2.500 - 3.000 km
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      5.000 - 7.000 km
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      2.000 km
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Aceite Sintético
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      4.000 - 5.000 km
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      7.000 - 10.000 km
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      2.500 - 3.000 km
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* CTA Final */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mt: 6,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius-lg)',
            textAlign: 'center',
          }}
        >
          {blogPost.slug === 'guia-mantenimiento-carburador' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                🚀 Dejá tu carburación en manos expertas
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 2,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                Limpiar un carburador parece fácil, pero dejarlo bien carburado requiere oído y experiencia. En nuestro taller desarmamos, limpiamos por ultrasonido y regulamos tu moto para que gaste lo justo y rinda al máximo.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                ¿Sentís que tu moto está &quot;chancha&quot;? Traela y la dejamos regulando como un relojito suizo.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Consultar presupuesto por Limpieza de Carburador
                </Link>
              </Box>
            </>
          ) : blogPost.slug === 'moto-parada-revision-puesta-punto' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                🚀 ¿Querés volver a rodar con tranquilidad?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 2,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                No fuerces el motor. Si tu moto estuvo parada más de 3 meses, traela al taller para una puesta a punto rápida. Revisamos niveles, batería y presión para que tu vuelta a las rutas sea segura.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Consultar por Puesta a Punto
                </Link>
              </Box>
            </>
          ) : blogPost.slug === 'guia-cambio-aceite-segun-conduccion' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                🛠️ En nuestro taller cuidamos tu motor
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 2,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                No solo cambiamos el aceite; revisamos el filtro, la arandela del tapón y el estado general de tu planta impulsora. Usamos solo marcas líderes que garantizan la máxima protección.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                ¿No recordás cuándo fue tu último cambio? Vení a visitarnos y realizamos un chequeo rápido de niveles sin cargo.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Consultar marcas y precios de Service
                </Link>
              </Box>
            </>
          ) : blogPost.slug === 'casco-vencido-verdad-que-pocos-te-cuentan' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                🛡️ Tu seguridad es nuestra prioridad
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                No te la juegues con tu casco. Si tenés dudas sobre la fecha de fabricación o el estado de tu casco, traelo al taller para una revisión. Queremos que salgas a la ruta protegido.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Consultar por revisión de casco
                </Link>
              </Box>
            </>
          ) : blogPost.slug === '5-senales-pastillas-freno-cambio-urgente' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                💡 Nuestro consejo experto
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 2,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                No te la juegues con los frenos. Unas pastillas en buen estado no solo te salvan de un accidente, sino que mantienen la integridad de tus discos y la suavidad de tu conducción.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                ¿Sentís alguna de estas señales en tu moto? En nuestro taller realizamos una revisión gratuita del sistema de frenos dentro de nuestro servicio de Mantenimiento Preventivo.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Reservar turno de revisión
                </Link>
              </Box>
            </>
          ) : blogPost.slug === 'como-limpiar-tensar-cadena-moto-paso-paso' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                ¿No tenés tiempo o preferís que lo haga un experto?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 2,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                Un mal tensado puede dañar los rodamientos de tu moto o, peor aún, provocar que la cadena se corte en movimiento.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                Si preferís que revisemos tu kit de arrastre y realicemos un Mantenimiento Preventivo profesional, ¡estamos para ayudarte!
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Agendar turno por WhatsApp
                </Link>
              </Box>
            </>
          ) : blogPost.slug === 'neumaticos-cuando-cambiarlos-presion-kits-reparacion' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                ¿Dudas sobre el estado de tus neumáticos?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 2,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                No te la juegues adivinando. Pasate por el taller y hacemos un chequeo técnico de desgaste y presión.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                Queremos que salgas a la ruta con total tranquilidad. ¡Te esperamos!
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Consultar por revisión de neumáticos
                </Link>
              </Box>
            </>
          ) : blogPost.slug === 'manual-clave-para-no-gastar-de-mas' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                ¿Te resulta muy técnico o no tenés tiempo?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                Si preferís que un profesional configure tu moto o revise que todo esté según el manual de fábrica, acercate al taller. Nosotros nos encargamos de que la teoría se aplique a la perfección en tu máquina. ¡Te esperamos!
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Consultar por service completo
                </Link>
              </Box>
            </>
          ) : blogPost.slug === 'bateria-como-evitar-muerte-por-falta-uso' ? (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                ¿La moto ya no arranca o sospechás que la batería está agotada?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                Antes de comprar una nueva, acercate al taller. Hacemos un test de carga y revisamos el estado de tu alternador para asegurarnos de que el problema no sea el sistema eléctrico de la moto. ¡Te esperamos!
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 600,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Consultar por revisión de batería
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                ¿Necesitas ayuda profesional?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-secondary)',
                  mb: 3,
                }}
              >
                Si prefieres dejar el mantenimiento en manos de expertos, en RiderBross estamos
                especializados en el cuidado de tu moto. Contacta con nosotros para agendar una
                revisión completa.
              </Typography>
              <Link
                href="/consulta"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  fontWeight: 600,
                  transition: 'all 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--secondary)';
                }}
              >
                Contactar
              </Link>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

